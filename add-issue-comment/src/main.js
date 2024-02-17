// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const issue_number = github.context.issue_number
        const message = core.getInput("message", { required: true })

        const octkit = github.getOctokit(token)

        octkit.rest.pulls.createReviewComment({
            ...github.context.repo,
            pull_number: issue_number,
            message: message
        })

        core.info(`==> PR #${pr_number} to add PR comment`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()