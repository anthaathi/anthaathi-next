#!/bin/bash

export CONFIG_BLOCK="https://form.pr-$CI_MERGE_REQUEST_ID.anthaathi.corp.internal {
  rewrite * /static-sites/$CI_COMMIT_REF_SLUG/form{path}
  rewrite / /static-sites/$CI_COMMIT_REF_SLUG/form/index.html
  reverse_proxy $CADDY_REVERSE_PROXY

  handle_errors {
		rewrite * /static-sites/$CI_COMMIT_REF_SLUG/form/index.html
		reverse_proxy $CADDY_REVERSE_PROXY
	}
}
"
