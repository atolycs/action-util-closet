// dismiss-approve

const core = require("@actions/core")
const github = require("@actions/github")

async function main() {
    try {
        const token = core.getInput("token", { required: true })
        const pr_number = core.getInput("pr", { required: true })
        const message = core.getInput("message", { required: true })

        const octkit = github.getOctokit(token)

        const reviews = await octkit.rest.pulls.listReviews({
            ...github.context.repo,
            pull_number: pr_number
        })

        for ( const review of reviews.data ) {
            if ( review.state != "APPROVED" ) {
                continue
            }

            core.info(`==> Dismissing approvals in PR #${pr_number}`)

            octkit.rest.pulls.dismissReview({
                ...github.context.repo,
                pull_number: pr_number,
                review_id: review.id,
                message: message
            })
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()