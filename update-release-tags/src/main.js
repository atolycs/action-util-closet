const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const token = core.getInput('token', { required: true })
    const version_tags = core.getInput('version_tags', { required: true })

    const octkit = github.getOctokit(token)

    const major_version = version_tags.split('.')[0]

    const _alias_sha = await octkit.rest.git.getRef({
      ...github.context,
      ref: `tags/${version_tags}`,
    })

    let ref
    try {
      ref = await octkit.rest.git.getRef({
        ...github.context,
        ref: `tags/${major_version}`,
      })
      core.info(`tag ${major_version} already exists.\noverwrite.`)
    } catch (error) {
      core.info(`tag ${major_version} does not exist yet.\ncreating.`)
    }

    if (ref) {
      await octkit.rest.git.updateRef({
        ...github.context,
        sha: _alias_sha.object.sha,
        ref: `tags/${major_version}`,
        force: true,
      })
      core.info(`tag ${version_tags} link to ${major_version}. `)
    } else {
      await octkit.rest.git.createRef({
        ...github.context,
        sha: _alias_sha.object.sha,
        ref: `tags/${major_version}`,
      })
      core.info(`create tag ${version_tags} link to ${major_version}. `)
    }
  } catch (error) {
    core.setFailed(error)
  }
}

main()
