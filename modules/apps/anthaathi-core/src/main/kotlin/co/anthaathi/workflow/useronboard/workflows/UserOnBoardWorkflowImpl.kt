package co.anthaathi.workflow.useronboard.workflows

import co.anthaathi.workflow.useronboard.activities.UserOnBoardActivities
import io.temporal.activity.ActivityOptions
import io.temporal.common.RetryOptions
import io.temporal.workflow.Workflow
import java.time.Duration


class UserOnBoardWorkflowImpl : UserOnBoardWorkflow {
	// RetryOptions specify how to automatically handle retries when Activities fail.
	private val retryOptions = RetryOptions.newBuilder()
		.setInitialInterval(Duration.ofSeconds(1))
		.setMaximumInterval(Duration.ofSeconds(100))
		.setBackoffCoefficient(2.0)
		.setMaximumAttempts(10)
		.build()

	private val options: ActivityOptions = ActivityOptions.newBuilder()
		.setStartToCloseTimeout(Duration.ofSeconds(5))
		.setRetryOptions(retryOptions)
		.build()

	// ActivityStubs enable calls to methods as if the Activity object is local, but actually perform an RPC.
	private val perActivityMethodOptions: HashMap<String?, ActivityOptions?> =
		object : HashMap<String?, ActivityOptions?>() {
			init {
				put(USER_ONBOARD, ActivityOptions.newBuilder().setHeartbeatTimeout(Duration.ofSeconds(5)).build())
			}
		}

	private val activities = Workflow.newActivityStub(
		UserOnBoardActivities::class.java, options, perActivityMethodOptions
	)

	override fun inviteUser(email: List<String>, role: String, org: String): String? {
		return activities.inviteUser(email, role, org)
	}

	companion object {
		const val USER_ONBOARD = "UserBoard"
	}
}
