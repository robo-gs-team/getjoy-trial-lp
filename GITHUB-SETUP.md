# GitHub Setup for GetJoy Trial LP

## Repository Details
- **Repo**: `robo-gs-team/getjoy-trial-lp`
- **URL**: https://github.com/robo-gs-team/getjoy-trial-lp
- **Account**: robo-gs-team (work account)
- **Access**: Public

## Authentication

GitHub Personal Access Token stored locally in `robo-gs-github-token.txt` (not committed to repo).

### Future Pushes
To push changes using the stored token:

```bash
TOKEN=$(cat robo-gs-github-token.txt)
git remote set-url origin "https://${TOKEN}@github.com/robo-gs-team/getjoy-trial-lp.git"
git push -u origin master
```

Or manually:
```bash
git remote set-url origin https://[TOKEN]@github.com/robo-gs-team/getjoy-trial-lp.git
git push origin master
```

### Token Permissions
- Repository: `getjoy-trial-lp` only
- Scope: Contents (read/write)
- Expires: 30 days (Apr 11, 2026)

### Important
⚠️ **Keep `robo-gs-github-token.txt` secret!**
- Added to `.gitignore` (won't be committed)
- Never share the token
- Regenerate if compromised

## Initial Commit
- **Hash**: `efe112f`
- **Message**: Initial commit: GetJoy trial landing page with 11 CRO fixes + $9.99 pricing
- **Files**: 434 changed, 270982 insertions(+)
