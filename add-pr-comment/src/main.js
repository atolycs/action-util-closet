// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const pr_number = core.getInput("pr_number", { required: true }) || github.context.pr_number
        const message = core.getInput("message", { required: true })

        const octokit = github.getOctokit(token)
        
        const result = await octokit.rest.issues.createComment({
            ...github.context.repo,
            issue_number: pr_number,
            body: message
        }).data

        core.debug(result)

        // await octokit.rest.pulls.createReviewComment({
        //     ...github.context.repo,
        //     pull_number: pr_number,
        //     body: message
        // })

        core.info(`==> PR #${pr_number} to add PR comment`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()