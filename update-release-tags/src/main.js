const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const token = core.getInput('token', { required: true })
    const version_tags = core.getInput('version_tags', { required: true })

    const octkit = github.getOctokit(token)

    const simple_version_tags = version_tags.replace("ref\/tags\/", "")

    const major_version = simple_version_tags.split(".")[0]

    let ref
    try {
        ref = await octkit.rest.git.getRef({
            ...github.context,
            ref: `ref/tags/${major_version}`
        })
        core.info(`==> ${major_version} already exists. overwrite`)
    } catch(error) {
        core.info(`==> ${major_version} does not exsit. creating`)
    }

    if (ref) {
        await octkit.rest.git.updateRef({
            ...github.context,
            ref: `ref/tags/${major_version}`,
            force: true
        })
    } else {
        await octkit.rest.git.createTag({
            ...github.context,
            ref:
        })
    }

  } catch (error) {
    core.setFailed(error)
  }
}

main()
