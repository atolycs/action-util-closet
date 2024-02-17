// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const pr_number = github.context.payload.pull_request.number
        const message = core.getInput("message", { required: true })

        const octokit = github.getOctokit(token)
       
        await octokit.request.defaults({

        })

        const result = await octokit.rest.pulls.createReview({
            ...github.context.repo,
            pull_number: pr_number,
            event: "COMMENT",
            body: message, 
            headers: {
                authorization: `token ${token}`
            }
        })

        core.debug(result.data)

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