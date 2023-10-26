import { prisma } from './db';
import { Prisma } from './generated/client';

// eslint-disable-next-line
const data = require('./data/country.json');

import TaskTemplateCreateInput = Prisma.TaskTemplateCreateInput;
import XOR = Prisma.XOR;
import TaskTemplateUncheckedCreateInput = Prisma.TaskTemplateUncheckedCreateInput;
import TaskStatusUpdateInput = Prisma.TaskStatusUpdateInput;
import TaskStatusUncheckedUpdateInput = Prisma.TaskStatusUncheckedUpdateInput;
import TaskStatusCreateInput = Prisma.TaskStatusCreateInput;
import TaskStatusUncheckedCreateInput = Prisma.TaskStatusUncheckedCreateInput;

const seed = async () => {
  const config = {
    type: 'object',
    required: [
      'streetAddress',
      'city',
      'stateOrProvince',
      'zipOrPostalCode',
      'country',
      'technicalContact',
    ],
    properties: {
      streetAddress: {
        type: 'string',
        title: 'Street address',
        cellProps: { span: [12, 12, 6, 6] },
      },
      apartmentOrSuite: {
        type: 'string',
        title: 'Apartment or suite',
        cellProps: { span: [12, 12, 6, 6] },
      },
      city: {
        cellProps: { span: [12, 12, 6, 6] },
        type: 'string',
        title: 'City',
      },
      stateOrProvince: {
        cellProps: { span: [12, 12, 6, 6] },
        type: 'string',
        title: 'State or province',
      },
      zipOrPostalCode: {
        type: 'string',
        title: 'ZIP or postal code',
        cellProps: { span: [12, 12, 6, 6] },
      },
      country: {
        cellProps: { span: [12, 12, 6, 6] },
        type: 'string',
        title: 'Country',
        format: 'select',
        dataSource: {
          type: 'static',
          values: data,
        },
      },
      phone: {
        type: 'object',
        title: 'Phone',
        format: 'tel',
        properties: {
          country: { type: 'string', title: '' },
          phoneNumber: { type: 'string', title: '' },
        },
      },
      technicalContact: {
        type: 'string',
        format: 'email',
        title: 'Technical contact',
      },
    },
  };

  await prisma.organizationTemplate.upsert({
    create: {
      id: 1,
      name: 'Other',
      description: 'Other',
      config: config,
    },
    update: {
      config: config,
    },
    where: {
      id: 1,
    },
  });

  await prisma.groupTemplate.upsert({
    create: {
      id: 1,
      name: 'General',
      description: 'General',
      config: {
        type: 'object',
        properties: { location: { type: 'string', title: 'Location' } },
      },
    },
    update: {},
    where: {
      id: 1,
    },
  });

  const assessment: XOR<
    TaskTemplateCreateInput,
    TaskTemplateUncheckedCreateInput
  > = {
    id: 1,
    key: 'assessment',
    name: 'Assessments',
    description: '',
    autoAssignToSelf: false,
    config: {
      type: 'object',
      properties: {},
    },
  };

  await prisma.taskTemplate.upsert({
    update: assessment,
    where: {
      id: 1,
    },
    create: assessment,
  });

  const incidents: XOR<
    TaskTemplateCreateInput,
    TaskTemplateUncheckedCreateInput
  > = {
    id: 1,
    key: 'assessments',
    name: 'Assessments',
    description: '',
    autoAssignToSelf: false,
    config: {
      type: 'object',
      properties: {},
    },
  };

  await prisma.taskTemplate.upsert({
    update: incidents,
    where: {
      id: 1,
    },
    create: incidents,
  });

  const pending: XOR<TaskStatusCreateInput, TaskStatusUncheckedCreateInput> = {
    color: 'rgb(119, 119, 119)',
    name: 'Pending',
    systemStatus: 'Pending',
    id: 1,
  };

  await prisma.taskStatus.upsert({
    create: pending,
    update: pending,
    where: {
      id: 1,
    },
  });

  const done: XOR<TaskStatusCreateInput, TaskStatusUncheckedCreateInput> = {
    color: 'rgb(4, 136, 72)',
    name: 'Done',
    systemStatus: 'Done',
    id: 2,
  };

  await prisma.taskStatus.upsert({
    create: done,
    update: done,
    where: {
      id: 2,
    },
  });

  const blocked: XOR<TaskStatusCreateInput, TaskStatusUncheckedCreateInput> = {
    color: 'rgb(4, 136, 72)',
    name: 'Blocked',
    systemStatus: 'Blocked',
    id: 3,
  };

  await prisma.taskStatus.upsert({
    create: blocked,
    update: blocked,
    where: {
      id: 3,
    },
  });

  const inProgress: XOR<TaskStatusCreateInput, TaskStatusUncheckedCreateInput> =
    {
      color: 'rgb(255, 207, 112)',
      name: 'In progress',
      systemStatus: 'InProgress',
      id: 4,
    };

  await prisma.taskStatus.upsert({
    create: inProgress,
    update: inProgress,
    where: {
      id: 4,
    },
  });

  const rejected: XOR<TaskStatusCreateInput, TaskStatusUncheckedCreateInput> = {
    color: 'rgb(232, 92, 74)',
    name: 'Rejected',
    systemStatus: 'Rejected',
    id: 5,
  };

  await prisma.taskStatus.upsert({
    create: rejected,
    update: rejected,
    where: {
      id: 5,
    },
  });
};

seed();
