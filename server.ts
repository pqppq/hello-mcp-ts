import { FastMCP } from "fastmcp"
import { z } from "zod"

const server = new FastMCP({
	name: "My MCP server",
	version: "1.0.0"
})

// simple op
server.addTool({
	name: "add",
	description: "Add two numbers",
	parameters: z.object({
		a: z.number(),
		b: z.number()
	}),
	execute: async ({ a, b }) => {
		return String(a + b)
	}
})

// progress
server.addTool({
	name: "download",
	description: "File download",
	parameters: z.object({ url: z.string().url() }),
	execute: async ({ url }, { reportProgress }) => {
		reportProgress({
			progress: 0,
			total: 100
		})
		// process...
		reportProgress({
			progress: 100,
			total: 100
		})
		return "Finish."
	}
})

// available resource
server.addResource({
	uri: "file:///foo.txt",
	name: "text foo",
	mimeType: "text/plain",
	load: async () => {
		return { text: "<<Contents>>" }
	}
})

// resource template
server.addResourceTemplate({
	uriTemplate: "file:///foo/{bar}.txt",
	name: "text foo bar",
	mimeType: "text/plain",
	arguments: [
		{
			name: "bar",
			description: "bar", required: true
		}
	],
	load: async ({ bar }) => {
		return { text: `bar is ${bar}.` }
	}
})

// prompt
server.addPrompt({
	name: "git-commit",
	description: "Generate commit message",
	arguments: [
		{ name: "changes", description: "Git diff", required: true }
	],
	load: async ({ name }) => {
		return `Modify ${name}.`
	}
})

server.start({
	transportType: "stdio"
})
// server.start({
// 	transportType: "sse", // Server-Sent Events
// 	sse: { endpoint: "/sse", port: 8080 }
// })
