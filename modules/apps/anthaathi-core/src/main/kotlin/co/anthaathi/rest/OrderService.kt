package co.anthaathi.rest

import co.anthaathi.workflow.WorkflowWorker
import jakarta.inject.Inject
import jakarta.ws.rs.Consumes
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path
import jakarta.ws.rs.Produces
import jakarta.ws.rs.core.MediaType


@Path("/order")
class OrderService(
	@Inject
	var worker: WorkflowWorker
) {
	@GET
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	fun receiveOrder(): Map<String, Any?> {
		val result = worker.userOnBoardWorkflow.inviteUser(listOf("me@f22.dev"), "test", "")

		return mapOf(
			"data" to result
		)
	}
}
