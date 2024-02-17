// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const pr_number = core.getInput("pr_number", { required: true }) || github.context.pr_number
        const reviewers = core.getInput("reviewers", { required: false })
        const message = core.getInput("message", { required: true })

        const octokit = github.getOctokit(token)

        const reviewers_count = await octokit.rest.pulls.listReviews({
            ...github.context.repo,
            pull_number: pr_number
        })

        if ( reviewers_count.data.length > 0 ) {
            core.info("==> Assigned Reviewers")
        } else {
            core.info("==> No Reviewers")
            await octokit.rest.pulls.requestReviewers({
                ...github.context.repo,
                pull_number: pr_number,
                reviewers: reviewers
            })
        }

        await octokit.rest.pulls.createReviewComment({
            ...github.context.repo,
            pull_number: pr_number,
            body: message
        })

        core.info(`==> PR #${pr_number} to add PR comment`)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()