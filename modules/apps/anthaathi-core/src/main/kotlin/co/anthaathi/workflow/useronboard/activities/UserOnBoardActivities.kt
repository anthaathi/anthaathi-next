package co.anthaathi.workflow.useronboard.activities

import io.temporal.activity.ActivityInterface


@ActivityInterface
interface UserOnBoardActivities {
	fun inviteUser(email: List<String>, role: String, org: String): String?
}
