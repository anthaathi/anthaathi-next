package co.anthaathi.workflow.useronboard.workflows

import io.temporal.workflow.WorkflowInterface
import io.temporal.workflow.WorkflowMethod

@WorkflowInterface
interface UserOnBoardWorkflow {
	@WorkflowMethod
	fun inviteUser(email: List<String>, role: String, org: String): String?

	companion object {
		const val QUEUE = "user_onboard_activities"
	}
}
