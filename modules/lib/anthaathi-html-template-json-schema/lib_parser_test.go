package anthaathi_html_template_json_schema

import (
	"bytes"
	"encoding/json"
	"html/template"
	"log"
	"testing"
)

func TestParseTemplate(t *testing.T) {
	htmlTemplate := `<html>
<head>
	<title>{{ .Title }}</title>
</head>
<body>
	<h1>Hello {{ .Name }}!</h1>

	{{/* Text node */}}
	<p>This is a text node.</p>

	{{/* Variable node */}}
	<p>The value of x is: {{ .X }}</p>

	{{.Date.Format "Jan 2, 2006"}}

	{{/* Range node */}}
	<ul>
	{{ range $index, $element := .Items }}
		<li>Index: {{ $index }}, Element: {{ $element }} {{.LongTime}}</li>
	{{ end }}
	</ul>

	{{/* Conditional node */}}
	{{ if .Condition }}
		<p>The condition is true.</p>
	{{ else }}
		<p>The condition is false.</p>
	{{ end }}

	{{/* Conditional node */}}
	{{ if and .condition1 .condition2 }}
		<p>The condition is true.</p>
	{{ else }}
		<p>The condition is false.</p>
	{{ end }}

	{{/* Function node */}}
	<p>The length of the slice is {{ len .Items }}.</p>

	{{/* Template inclusion node */}}
	{{ template "footer" . }}

	{{/* Block definition node */}}
	{{ block "content" . }}
		<p>This is the default content.</p>
	{{ end }}

	{{/* Comment node */}}
	<!-- This is a comment. -->

</body>
</html>`

	// Parse the HTML template
	tmpl, err := template.New("htmlTemplate").Parse(htmlTemplate)
	if err != nil {
		log.Fatal(err)
	}

	err, a := ParseTemplate(tmpl)
	if err != nil {
		t.Fatal(err)
	}

	pretty, err := prettyJson(a)

	if err != nil {
		t.Fatal(err)
		return
	}

	t.Log(pretty)
}

const (
	empty = ""
	tab   = "\t"
)

func prettyJson(data interface{}) (string, error) {
	buffer := new(bytes.Buffer)
	encoder := json.NewEncoder(buffer)
	encoder.SetIndent(empty, tab)

	err := encoder.Encode(data)
	if err != nil {
		return empty, err
	}
	return buffer.String(), nil
}
