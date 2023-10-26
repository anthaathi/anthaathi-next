package co.anthaathi.workflow

import co.anthaathi.workflow.useronboard.activities.UserOnBoardActivitiesImpl
import co.anthaathi.workflow.useronboard.workflows.UserOnBoardWorkflow
import co.anthaathi.workflow.useronboard.workflows.UserOnBoardWorkflowImpl
import io.quarkus.runtime.ShutdownEvent
import io.quarkus.runtime.StartupEvent
import io.temporal.client.WorkflowClient
import io.temporal.client.WorkflowClientOptions
import io.temporal.client.WorkflowOptions
import io.temporal.serviceclient.WorkflowServiceStubs
import io.temporal.serviceclient.WorkflowServiceStubsOptions
import io.temporal.worker.Worker
import io.temporal.worker.WorkerFactory
import io.temporal.worker.WorkerFactoryOptions
import jakarta.enterprise.context.ApplicationScoped
import jakarta.enterprise.event.Observes
import jakarta.inject.Inject
import java.util.*


@ApplicationScoped
class WorkflowWorker(
	@Inject
	var userOnBoardActivities: UserOnBoardActivitiesImpl
) {
	private var factory: WorkerFactory? = null

	private lateinit var _client: WorkflowClient
	val client: WorkflowClient
		get() {
			return this._client
		}

	val userOnBoardWorkflow: UserOnBoardWorkflow
		get() {
			val workflowOptions = WorkflowOptions.newBuilder()
				.setWorkflowId(UUID.randomUUID().toString())
				.setTaskQueue(UserOnBoardWorkflow.QUEUE)
				.build()

			return client.newWorkflowStub(UserOnBoardWorkflow::class.java, workflowOptions)
		}

	fun onStart(@Observes event: StartupEvent?) {
		val service: WorkflowServiceStubs = WorkflowServiceStubs
			.newServiceStubs(
				WorkflowServiceStubsOptions.newBuilder().build()
			)

		val options = WorkflowClientOptions
			.newBuilder()
			.setNamespace("default")
			.build()

		_client = WorkflowClient.newInstance(service, options)

		val factorOptions = WorkerFactoryOptions.newBuilder()
			.build()
		factory = WorkerFactory.newInstance(_client, factorOptions)
		val worker: Worker = factory!!.newWorker(UserOnBoardWorkflow.QUEUE)

		worker.registerWorkflowImplementationTypes(UserOnBoardWorkflowImpl::class.java)
		worker.registerActivitiesImplementations(userOnBoardActivities)

		factory!!.start()
	}

	fun onStop(@Observes event: ShutdownEvent?) {
		factory?.shutdown()
	}
}
