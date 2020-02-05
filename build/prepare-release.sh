if [ ! -z "$(git status --untracked-files=no --porcelain)" ]; then
  echo 'Prepare failed, git working directory not clean.'
  exit 1
fi


lerna exec --parallel -- node \$LERNA_ROOT_PATH/build/prepare-pre-script.js

# Commit all package.json and CHANGELOG
version=`node $PWD/build/find-next-version.js`
git add -A
git commit -m "chore(prepare-release): $version [skip ci]"
git tag "prepare-v$version"
