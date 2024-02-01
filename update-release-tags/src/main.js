const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const token = core.getInput('token', { required: true })
    const version_tags = github.context.payload.inputs.target
    
    const octkit = github.getOctokit(token)

    //const simple_version_tags = version_tags.replace("ref\/tags\/", "")

    const api_tags_uri = github.context.payload.repository.tags_url.replace("https://api.github.com", "")

    const major_version = version_tags.split(".")[0]

    const tags_list = await octkit.request(`GET ${api_tags_uri}`) 

    const latest_version_sha = tags_list.data[0].commit.sha

    tags_list.data.forEach(async (element) => {
        if (element.name == major_version) {
            await octkit.rest.git.updateRef({
                ...github.context,
                ref: `tags/${major_version}`,
                sha: latest_version_sha,
                force: yes
            })
        } else {
            await octkit.rest.git.createRef({
                ...github.context,
                ref: `tags/${major_version}`,
                sha: latest_version_sha
            })
        }
    });


   } catch (error) {
    core.setFailed(error)
  }
}

main()
