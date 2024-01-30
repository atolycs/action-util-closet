// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const issue_title = core.getInput("title", { require: true })
        const issue_body = core.getInput("body", { required: false })
        const octkit = github.getOctokit(token)
        
        const issue_assigner = github.context.repo.owner

        const newIssue = await octkit.rest.issues.create({
            ...github.context.repo,
            title: issue_title,
            body: issue_body,
            assignee: issue_assigner
        })

        core.info(`==> Issue #${newIssue.number} created`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()