package co.anthaathi.entity

import io.quarkus.hibernate.reactive.panache.kotlin.PanacheCompanionBase
import io.quarkus.hibernate.reactive.panache.kotlin.PanacheEntityBase
import jakarta.persistence.*
import java.time.Instant
import java.util.*

@Entity
@Table(name = "organization_invitation", schema = "organization_invitation")
open class OrganizationInvitation : PanacheEntityBase {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", nullable = false)
	open var id: UUID? = null

	@Column(name = "user_id", nullable = false)
	open var userId: UUID? = null

	@Column(name = "organization_id", nullable = false)
	open var organizationId: UUID? = null

	@Column(name = "invited_at", nullable = false)
	open var invitedAt: Instant? = null

	companion object : PanacheCompanionBase<OrganizationInvitation, UUID>
}
