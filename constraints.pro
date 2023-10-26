gen_enforced_dependency(WorkspaceCwd, 'react', '^18.2.0', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'vite', '^4.1.2', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, '@vitejs/plugin-react', '^3.0.0', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, 'typescript', '^4.9.3', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'styletron-engine-atomic', '^1.5.0', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'styletron-react', '^6.1.0', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'baseui', '^12.2.0', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'recoil', '^0.7.6', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'react-router-dom', '^6.5.0', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'react-dom', '^18.2.0', dependencies) :-
	workspace_field(WorkspaceCwd, 'kind', 'webapp').

gen_enforced_dependency(WorkspaceCwd, 'prettier', '^2.8.1', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, '@yarnpkg/pnpify', '^4.0.0-rc.34', devDependencies).

gen_enforced_dependency(WorkspaceCwd, 'eslint', '^8.0.1', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, 'eslint-config-react-app', '^7.0.1', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

% React intl
gen_enforced_dependency(WorkspaceCwd, 'react-intl', '^6.2.5', dependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, '@formatjs/cli', '^5.1.10', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

% Jest configure for all packages

gen_enforced_dependency(WorkspaceCwd, 'jest', '^29.3.1', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, '@types/jest', '^29.2.4', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, '@anthaathi/eslint-config-react', 'workspace:*', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, 'prettier', null, dependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, 'wireit', '^0.9.2', devDependencies) :-
	workspace_field(WorkspaceCwd, 'version', _).

gen_enforced_dependency(WorkspaceCwd, DependencyIdent, 'workspace:*', DependencyType) :-
  workspace_ident(_, DependencyIdent),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, DependencyType).
