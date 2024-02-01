const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const token = core.getInput('token', { required: true })
    const version_tags = core.getInput('version_tags', { required: true })

    const octkit = github.getOctokit(token)

    const simple_version_tags = version_tags.replace("ref\/tags\/", "")

    const major_version = simple_version_tags.split(".")[0]

    console.log(github.context)

   } catch (error) {
    core.setFailed(error)
  }
}

main()
