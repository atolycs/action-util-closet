const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    const token = core.getInput('token', { required: true })
    const version_tags = github.context.payload.inputs.target
    
    const octkit = github.getOctokit(token)

    //const simple_version_tags = version_tags.replace("ref\/tags\/", "")

    const { baseUrl } = octkit.request.defaults()
    const api_tags_uri = github.context.payload.repository.tags_url.replace(baseUrl, "")

    const major_version = version_tags.split(".")[0]

    console.log(api_tags_uri)
    

   } catch (error) {
    core.setFailed(error)
  }
}

main()
