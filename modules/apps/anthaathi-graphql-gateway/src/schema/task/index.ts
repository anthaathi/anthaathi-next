import { prisma } from '../../db';
import { builder } from '../index';
import { UserInfo } from '../user';
import _ from 'lodash';
import type { SystemStatus, Task } from '../../generated/client';

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const taskTemplate = builder.prismaNode('TaskTemplate', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name'),
    description: t.exposeString('description', {
      nullable: true,
    }),
    config: t.expose('config', {
      type: 'Json',
    }),
		key: t.exposeString('key', {
			nullable: true
		}),
    iid: t.exposeInt('id'),
  }),
});

const TaskSystemTask = builder.enumType('TaskSystemTask', {
  values: ['Done', 'Pending', 'Blocked', 'InProgress', 'Rejected'],
});

const TaskStatus = builder.prismaNode('TaskStatus', {
  id: { field: 'id' },
  fields: (t) => ({
    name: t.exposeString('name'),
    description: t.exposeString('description', {
      nullable: true,
    }),
    systemStatus: t.expose('systemStatus', {
      type: TaskSystemTask,
      nullable: true,
    }),
  }),
});

builder.queryField('taskStatuses', (t) =>
  t.prismaConnection({
    cursor: 'id',
    args: {
      organization: t.arg.globalID({
        required: true,
      }),
    },
    resolve(query, parent, args, context, info) {
      return prisma.taskStatus.findMany({
        ...query,
        where: {
          OR: [
						{
							organization: {
								recentOrganization: {
									some: {
										userId: context.session.identity?.id,
									},
								},
							},
						},
						{
							organizationId: null,
						}
					]
        },
      });
    },
    type: TaskStatus,
  }),
);

const taskRefferedBy = builder.prismaNode('TaskRefferedBy', {
  id: { field: 'id' },
  fields: (t) => ({
    customer: t.relation('customer'),
    iid: t.exposeInt('id'),
    task: t.relation('task'),
  }),
});

const Task = builder.prismaNode('Task', {
  id: { field: 'id' },
  fields: (t) => ({
    title: t.exposeString('title'),
    description: t.exposeString('description', {
      nullable: true,
    }),
    data: t.expose('data', {
      type: 'Json',
    }),
    createdAt: t.expose('createdAt', {
      type: 'Date',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'Date',
    }),
    author: t.field({
      type: UserInfo,
      resolve: async (root, args, ctx) => {
        return UserInfo.fromId(root.author);
      },
    }),
    priority: t.exposeString('priority', {
      nullable: true,
    }),
    startDate: t.expose('startDate', {
      nullable: true,
      type: 'Date',
    }),
    dueDate: t.expose('dueDate', {
      nullable: true,
      type: 'Date',
    }),
    emoji: t.exposeString('emoji', {
      nullable: true,
    }),
    customer: t.relation('customer', {
      nullable: true,
    }),
    referredByV2: t.relatedConnection('taskRefferedBy', {
      cursor: 'id',
    }),
    referredBy: t.prismaConnection({
      type: 'Customer',
      cursor: 'id',
      deprecationReason: 'Migrated to V2',
      resolve(query, parent, args, context, info) {
        return prisma.customer.findMany({
          ...query,
          where: {
            taskRefferedBy: {
              some: {
                taskId: parent.id,
              },
            },
          },
        });
      },
    }),
    assigned: t.relatedConnection('assignedUser', {
      cursor: 'id',
      query: (args, context) => ({}),
    }),
    statusId: t.expose('statusId', {
      type: 'Int',
      nullable: true,
    }),
    status: t.relation('status', {
      nullable: true,
    }),
    template: t.relation('template', {}),
  }),
});

builder.prismaNode('TaskAssignedUser', {
  id: { field: 'id' },
  fields: (t) => ({
    assignedAt: t.expose('createdAt', {
      type: 'Date',
    }),
    user: t.field({
      type: UserInfo,
      resolve: async (root, args, ctx) => {
        return UserInfo.fromId(root.user);
      },
    }),
  }),
});

builder.queryField('taskTemplates', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'TaskTemplate',
    args: {
      organization: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.taskTemplate.findMany({
        ...query,
        where: {
          OR: [
						{
							organizationId: args.organization?.id,
						},
						{
							organizationId: null,
						}
					]
        },
      });
    },
  }),
);

function queryTaskTemplates({
  includeCompleted,
  ...args
}: {
  includeCompleted: boolean;
  customerId?: number;
  customerGroupId?: number;
  query?: string;
  assignedTo?: { id: string }[];
  templateId?: { id: string }[];
  statusId?: string;
	templateKey?: string;
	organization: string;
	showOnlyCompleted: boolean;
}) {
  return {
    where: {
      ...(args.assignedTo
        ? {
            assignedUser: {
              some: {
                user: {
                  in: args.assignedTo.map((id) => id.id),
                },
              },
            },
          }
        : {}),

      ...(!includeCompleted
        ? {
            status: {
              isNot: {
                systemStatus: {
                  in: ['Done', 'Rejected'] as SystemStatus[],
                },
              },
            },
          }
        : {}),

      ...(args.showOnlyCompleted
        ? {
            status: {
              is: {
                systemStatus: {
                  in: ['Done', 'Rejected'] as SystemStatus[],
                },
              },
            },
          }
        : {}),

      ...(args.customerId && !isNaN(+args.customerId)
        ? {
            customerId: {
              equals: +args.customerId,
            },
          }
        : {}),

      ...(args.customerGroupId && !isNaN(+args.customerGroupId)
        ? {
            customer: {
              customerGroupAssociation: {
                some: {
                  customerGroupId: {
                    equals: args.customerGroupId,
                  },
                },
              },
            },
          }
        : {}),

      ...(args.templateId
        ? {
            taskTemplateId: {
              in: args.templateId
                .map((id) => +id.id)
                .filter((res) => !isNaN(res)),
            },
          }
        : {}),

      ...(args.query
        ? {
            OR: [
              {
                title: {
                  contains: args.query,
                },
                description: {
                  contains: args.query,
                },
              },
            ],
          }
        : {}),

      ...(args.statusId && !isNaN(+args.statusId)
        ? {
            statusId: {
              equals: +args.statusId,
            },
          }
        : {}),

			...(args.templateKey ? {
				template: {
					key: args.templateKey,
				},
			} : {}),

      AND: {
        organizationId: args.organization,
      },
    },
  };
}

builder.queryField('tasks', (t) =>
  t.prismaConnection({
    cursor: 'id',
    type: 'Task',
    args: {
      query: t.arg.string({
        required: false,
      }),
      customerId: t.arg.globalID({
        required: false,
      }),
      customerGroupId: t.arg.globalID({
        required: false,
      }),
      organization: t.arg.globalID({
        required: true,
      }),
      assignedTo: t.arg.globalIDList({
        required: false,
      }),
      templateId: t.arg.globalIDList({
        required: false,
      }),
			templateKey: t.arg.string({
        required: false,
      }),
      statusId: t.arg.globalID({
        required: false,
      }),
      includeCompleted: t.arg.boolean({
        required: false,
      }),
      showOnlyCompleted: t.arg.boolean({
        required: false,
      }),
    },
    totalCount: (parent, args, context, info) => {
      return prisma.task.count(
        queryTaskTemplates({
          customerId: args.customerId?.id ? +args.customerId.id : undefined,
          customerGroupId: args.customerGroupId?.id
            ? +args.customerGroupId.id
            : undefined,
          query: args.query ?? undefined,
          assignedTo: args.assignedTo ?? undefined,
          showOnlyCompleted: args.showOnlyCompleted ?? false,
          templateId: args.templateId
            ? args.templateId.map((res) => ({ id: res.id }))
            : undefined,
          includeCompleted: args.includeCompleted ?? false,
          statusId: args.statusId?.id,
          organization: args.organization?.id,
					templateKey: args.templateKey ?? undefined
        }),
      );
    },
    resolve: async (query, parent, args, context, info) => {
      return prisma.task.findMany({
        ...query,
        orderBy: [
          { dueDate: 'asc' },
          {
            createdAt: 'desc',
          },
        ],
        ...queryTaskTemplates({
          customerId: args.customerId?.id ? +args.customerId.id : undefined,
          customerGroupId: args.customerGroupId?.id
            ? +args.customerGroupId.id
            : undefined,
          query: args.query ?? undefined,
          showOnlyCompleted: args.showOnlyCompleted ?? false,
          assignedTo: args.assignedTo ?? undefined,
          templateId: args.templateId
            ? args.templateId.map((res) => ({ id: res.id }))
            : undefined,
          includeCompleted: args.includeCompleted ?? false,
          statusId: args.statusId?.id,
          organization: args.organization?.id,
					templateKey: args.templateKey ?? undefined
        }),
      });
    },
  }),
);

builder.relayMutationField(
  'createTask',
  {
    inputFields: (t) => ({
      title: t.string({
        required: true,
      }),
      organizationId: t.globalID({
        required: true,
      }),
      templateId: t.globalID({
        required: true,
      }),
      customer: t.globalID({
        required: false,
      }),
      description: t.string({ required: false }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const task = await prisma.$transaction(async (tx) => {
        const status = await prisma.taskStatus.findFirst({
          where: {
            systemStatus: {
              equals: 'Pending',
            },
            organizationId: {
              equals: args.input.organizationId.id,
            },
          },
        });

        const defaultAssignment = await prisma.defaultAssigned.findMany({
          where: {
            taskTemplateId: {
              equals: +args.input.templateId.id,
            },
          },
        });

        const template = await prisma.taskTemplate.findFirstOrThrow({
          where: {
            id: +args.input.templateId.id,
          },
        });

        const assignedUsers = [
          ...defaultAssignment.map((res) => res.userId),
          template.autoAssignToSelf ? context.session.identity?.id : undefined,
        ].filter(Boolean) as string[];

        return prisma.task.create({
          data: {
            author: context.session.identity!.id,
            title: args.input.title,
            description: args.input.description,
            data: {},
            assignedUser: {
              create: assignedUsers.map((res) => ({
                user: res,
              })),
            },
            status: status
              ? {
                  connect: {
                    id: status.id,
                  },
                }
              : undefined,
            organization: {
              connect: {
                id: args.input.organizationId.id,
              },
            },
            template: {
              connect: {
                id: +args.input.templateId.id,
              },
            },
            ...(args.input.customer?.id
              ? {
                  customer: {
                    connect: {
                      id: +args.input.customer?.id,
                    },
                  },
                }
              : {}),
          },
          ...parent,
        });
      });

      return {
        task,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
      }),
    }),
  },
);

builder.relayMutationField(
  'updateTaskData',
  {
    inputFields: (t) => ({
      id: t.globalID({
        required: true,
      }),
      data: t.field({
        type: 'Json',
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const task = await prisma.task.findFirstOrThrow({
        where: {
          id: +args.input.id.id,
        },
        include: {
          template: true,
          customer: true,
        },
      });

      let title: string | null = null;

      if (task.template.titleTemplate) {
        const compiled = _.template(task.template.titleTemplate);

        title = compiled({
          user: context.session.identity?.id,
          customer: task.customer,
          task,
          data: args.input.data,
        });
      }

      let description: string | null = null;

      if (task.template.descriptionTemplate) {
        const compiled = _.template(task.template.descriptionTemplate);

        description = compiled({
          user: context.session.identity?.id,
          customer: task.customer,
          task,
          data: args.input.data,
        });
      }

      const returnData = await prisma.task.update({
        where: {
          id: +args.input.id.id,
        },
        data: {
          data: (args.input.data as never) ?? {},
          title: title ?? task.title,
          description: description ?? task.description,
        },
      });

      return {
        task: returnData,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
      }),
    }),
  },
);

builder.relayMutationField(
  'assignUserToTask',
  {
    inputFields: (t) => ({
      taskId: t.globalID({
        required: true,
      }),
      userId: t.globalID({
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const result = await prisma.taskAssignedUser.create({
        data: {
          taskId: +args.input.taskId.id,
          user: args.input.userId.id,
        },
        include: {
          task: true,
        },
      });

      return {
        task: result.task,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
        nullable: true,
      }),
    }),
  },
);

builder.relayMutationField(
  'removeUserFromTask',
  {
    inputFields: (t) => ({
      taskId: t.globalID({
        required: true,
      }),
      userId: t.globalID({
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const result = await prisma.taskAssignedUser.deleteMany({
        where: {
          taskId: +args.input.taskId.id,
          user: args.input.userId.id,
        },
      });

      return {
        success: result.count > 0,
      };
    },
  },
  {
    outputFields: (t) => ({
      success: t.expose('success', {
        type: 'Boolean',
        nullable: true,
      }),
    }),
  },
);

builder.relayMutationField(
  'changeTaskDueDate',
  {
    inputFields: (t) => ({
      taskId: t.globalID({
        required: true,
      }),
      dueDate: t.field({
        type: 'Date',
        required: false,
      }),
      startDate: t.field({
        type: 'Date',
        required: false,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const result = await prisma.task.update({
        where: {
          id: +args.input.taskId.id,
        },
        data: {
          dueDate: args.input.dueDate ?? undefined,
          startDate: args.input.startDate ?? undefined,
        },
      });

      return {
        task: result,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
        nullable: true,
      }),
    }),
  },
);

builder.relayMutationField(
  'changeTaskStatus',
  {
    inputFields: (t) => ({
      taskId: t.globalID({
        required: true,
      }),
      statusId: t.globalID({
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const task = await prisma.task.update({
        where: {
          id: +args.input.taskId.id,
        },
        data: {
          statusId: +args.input.statusId.id,
        },
      });

      return {
        task,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
        nullable: true,
      }),
    }),
  },
);

builder.relayMutationField(
  'addReferenceToTask',
  {
    inputFields: (t) => ({
      taskId: t.globalID({
        required: true,
      }),
      customerId: t.globalID({
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const result = await prisma.taskRefferedBy.create({
        data: {
          customerId: +args.input.customerId.id,
          taskId: +args.input.taskId.id,
        },
        include: {
          task: true,
        },
      });

      return {
        task: result.task,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
      }),
    }),
  },
);

builder.relayMutationField(
  'updateTaskPriority',
  {
    inputFields: (t) => ({
      taskId: t.globalID({
        required: true,
      }),
      priority: t.field({
        type: 'String',
        required: false,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const task = await prisma.task.update({
        where: {
          id: +args.input.taskId.id,
        },
        data: {
          priority: args.input.priority,
        },
      });

      return {
        task,
      };
    },
  },
  {
    outputFields: (t) => ({
      task: t.expose('task', {
        type: Task,
        nullable: true,
      }),
    }),
  },
);

class TaskFeedback {
  constructor(
    public id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public config: any,
  ) {}
}

builder.node(TaskFeedback, {
  id: {
    resolve: (root) => root.id,
    parse: (value) => value,
  },
  fields: (t) => ({
    config: t.field({
      type: 'Json',
      resolve: (root) => root.config,
    }),
  }),
  loadOne: async (id) => {
    const feedback = await prisma.task.findFirstOrThrow({
      where: {
        taskFeedbackSubmissionId: id,
        OR: [
          {
            feedbackEnabled: true,
          },
          {
            template: {
              feedbackEnabled: true,
            },
          },
        ],
        taskFeedbackSubmission: {
          none: {},
        },
      },
      include: {
        taskFeedbackForm: true,
        template: {
          include: {
            feedbackForm: true,
          },
        },
      },
    });

    if (
      !feedback.taskFeedbackSubmissionId ||
      (!feedback.taskFeedbackForm && !feedback?.template?.feedbackForm)
    ) {
      throw new Error('Task feedback not enabled');
    }

    const form =
      feedback.taskFeedbackForm?.form ??
      feedback?.template?.feedbackForm?.form ??
      {};

    return new TaskFeedback(
      feedback.taskFeedbackSubmissionId?.toString() ?? '',
      form,
    );
  },
  name: 'TaskFeedback',
});

builder.relayMutationField(
  'createTaskFeedback',
  {
    inputFields: (t) => ({
      feedbackId: t.globalID({
        required: true,
      }),
      data: t.field({
        type: 'Json',
        required: true,
      }),
    }),
  },
  {
    resolve: async (parent, args, context, info) => {
      const task = await prisma.task.findFirstOrThrow({
        where: {
          taskFeedbackSubmissionId: args.input.feedbackId.id,
          OR: [
            {
              feedbackEnabled: true,
            },
            {
              template: {
                feedbackEnabled: true,
              },
            },
          ],
        },
      });

      if (!task.taskFeedbackSubmissionId) {
        throw new Error('Task feedback not enabled');
      }

      await prisma.taskFeedbackSubmission.create({
        data: {
          data: args.input.data as never,
          task: {
            connect: {
              id: task.id,
            },
          },
        },
      });

      return {
        success: true,
      };
    },
  },
  {
    outputFields: (t) => ({
      success: t.expose('success', {
        type: 'Boolean',
        nullable: true,
      }),
    }),
  },
);
