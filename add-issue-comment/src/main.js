// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const issue_number = github.context.payload.pull_request.number
        const message = core.getInput("message", { required: true })

        const octokit = github.getOctokit(token)

        octokit.rest.pulls.createReviewComment({
            ...github.context.repo,
            pull_number: issue_number,
            message: message
        })

        core.info(`==> PR #${issue_number} to add comment`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()