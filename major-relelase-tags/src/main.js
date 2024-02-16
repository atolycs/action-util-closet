const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const token = core.getInput('token', { required: true });
    const version_tags = core.getInput('alias_version', { required: true });

    const commit_user_id = core.getInput('commit-user-id', { required: true });
    const commit_email = core.getInput('commit-email', { required: true });

    const octokit = github.getOctokit(token);
    let tags_tmp = new Object({})

    core.info(`==> Searching tag ${version_tags}`);
    // Get alias to version tags
    const getRef_alias = await octokit.rest.git.getRef({
      ...github.context.repo,
      ref: `tags/${version_tags}`,
    });

    core.debug(github.context.repo.owner);
    core.debug(github.context.repo.repo);
    //const getRef_alias = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
    //  owner: github.context.repo.owner,
    //  repo: github.context.repo.repo,
    //  ref: `tags/${version_tags}`,
    //});

    const target_sha = getRef_alias.data.object.sha;

    core.info(`Get ${version_tags} sha ==> ${target_sha}`);

    tags_tmp.alias_sha = target_sha

    // setup Major version
    const major_version = version_tags.split('.')[0];

    // check major version tags
    const major_version_detect = availableTags(octokit, major_version)

    tags_tmp.major_sha = major_version_detect.data.object.sha

    // Create or Update Tagging Major version tags

    core.info(`==> Adding ${major_version} to ${target_sha}`);
    const tags_data = await octokit.rest.git.createTag({
      ...github.context.repo,
      tag: major_version,
      message: `Update Routing ${major_version} to ${version_tags}`,
      object: target_sha,
      type: 'commit',
      tagger: {
        name: commit_user_id,
        email: commit_email,
      },
    });

    // Create Reference
    // await octokit.rest.git.createRef({
    //   ...github.context.repo,
    //   ref: `refs/tags/${major_version}`,
    //   sha: tags_data.data.sha,
    // });

    core.info(`Tag Create or Updated ${major_version} => ${version_tags}`);
  } catch (error) {
    core.setFailed(`==> Failed. \n${error.message}`);
  }
}

run();

async function availableTags(octokit, tags) {
  return await octokit.rest.git.getRef({
    ...github.context.repo,
    ref: `tags/${tags}`
  })
}

async function createorUpdate(octokit, mode, tags) {
  if (tags.major_sha) {
    core.info(`Detected Major version tags`)
    core.info(`Recreate Updateing...`)

    octokit.rest.git.createTag({
      ...github.context.repo,
      tag: major_version,
      
    })

  } else {

  }

}

//async function availableTags(octokit, tags) {
//
//}
