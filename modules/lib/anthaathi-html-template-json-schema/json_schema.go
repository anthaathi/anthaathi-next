package anthaathi_html_template_json_schema

type JSONSchema interface{}

type StringSchema struct {
	Type   string `json:"type"`
	Title  string `json:"title"`
	Format string `json:"format"`
}

type BooleanSchema struct {
	Type  string `json:"type"`
	Title string `json:"title"`
}

type ObjectSchema struct {
	Type       string                `json:"type"`
	Title      string                `json:"title"`
	Properties map[string]JSONSchema `json:"properties"`
}

type ArraySchema struct {
	Type  string     `json:"type"`
	Title string     `json:"title"`
	Items JSONSchema `json:"items"`
}
