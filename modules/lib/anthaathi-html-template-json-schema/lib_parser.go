package anthaathi_html_template_json_schema

import (
	"bytes"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"html/template"
	"strings"
	"text/template/parse"
	"unicode"
)

func ParseTemplate(htmlTemplate *template.Template) (error, JSONSchema) {
	nodes := convertToNodes(htmlTemplate.Templates()[0].Tree.Root.Nodes)

	return nil, nodes
}

func convertToNodes(nodes []parse.Node) JSONSchema {
	schema := ObjectSchema{
		Type:       "object",
		Title:      "",
		Properties: make(map[string]JSONSchema),
	}

	for _, n := range nodes {
		if rangeNode, ok := n.(*parse.RangeNode); ok {

			fmt.Printf("rangeNode: %v\n", rangeNode)

			// Determine the name of the variable being ranged over
			variable := strings.TrimSpace(rangeNode.String())
			variable = strings.TrimPrefix(variable, "$")
			variable = strings.TrimSuffix(variable, " ")

			name, _ := extractName(rangeNode.Pipe.Cmds[0].Args[0].String())

			schema.Properties[name] = ArraySchema{
				Type:  "array",
				Title: addSpace(name),
				Items: convertToNodes(rangeNode.BranchNode.List.Nodes),
			}
		}

		if ifNode, ok := n.(*parse.IfNode); ok {
			rawIfNodeName := ifNode.Pipe.Cmds[0].Args[0].String()

			if !strings.HasPrefix(rawIfNodeName, ".") {
				continue
			}

			ifNodeName, _ := extractName(rawIfNodeName)

			booleanSchema := BooleanSchema{
				Type:  "boolean",
				Title: ifNodeName,
			}

			schema.Properties[ifNodeName] = booleanSchema

			//return convertToNodes(ifNode.List.Nodes)
		}

		if actionNode, ok := n.(*parse.ActionNode); ok && actionNode.Pipe != nil {
			// Determine the name of the variable or function being called
			actionName, parts := extractName(actionNode.String())

			if actionName == ".Date.Format" {
				actionName = strings.Join(parts[1:], " ")

				if strings.HasSuffix(actionName, "\"") {
					continue
				}

				schema.Properties[actionName] = StringSchema{
					Type:   "string",
					Title:  actionName,
					Format: "date-time",
				}
				continue
			}

			if len(parts) > 1 {
				continue
			}

			format := "text"

			if strings.Contains(strings.ToLower(actionName), "email") {
				format = "email"
			}

			if strings.Contains(strings.ToLower(actionName), "phone") {
				format = "phone"
			}

			schema.Properties[actionName] = StringSchema{
				Type:   "string",
				Title:  addSpace(actionName),
				Format: format,
			}
		}
	}

	return schema
}

func extractName(inputName string) (string, []string) {
	name := strings.TrimSpace(inputName)
	name = strings.TrimPrefix(name, "{{")
	name = strings.TrimSuffix(name, "}}")
	parts := strings.Split(name, " ")
	name = parts[0]

	if strings.HasPrefix(name, ".") {
		name = strings.TrimPrefix(name, ".")
	}

	return name, parts
}

func addSpace(s string) string {
	buf := &bytes.Buffer{}
	for i, rune1 := range s {
		if unicode.IsUpper(rune1) && i > 0 {
			buf.WriteRune(' ')
		}
		buf.WriteRune(rune1)
	}
	return buf.String()
}

func AddTargetBlank(html string) (string, error) {
	r := strings.NewReader(html)
	doc, err := goquery.NewDocumentFromReader(r)
	if err != nil {
		return "", err
	}

	// For each link, add target="_blank"
	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		href, exists := s.Attr("href")

		if exists && strings.HasPrefix(href, "#") {
			return
		}

		s.SetAttr("target", "_blank")
	})

	// Return the modified HTML
	return doc.Html()
}
