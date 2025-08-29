<h1 align="center">Signia</h1>
<div align="center">

Electronic signatures that feel wonderfully human

[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/opensignlabs/opensign.svg)](http://isitmaintained.com/project/opensignlabs/opensign "Average time to resolve an issue")
[![All Contributors](https://img.shields.io/github/all-contributors/opensignlabs/opensign?color=ee8449&style=flat-square)](#contributors)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/opensignlabs/opensign)
![GitHub last commit (by committer)](https://img.shields.io/github/last-commit/opensignlabs/opensign)


<a href="https://www.opensignlabs.com/">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.opensignlabs.com">Help Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://docs.opensignlabs.com/docs/API-docs/opensign-api-v-1">API Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.opensignlabs.com/blog">Blog</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://discord.com/invite/xe9TDuyAyj">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/opensignlabs">Twitter</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.linkedin.com/company/opensign%E2%84%A2/about/">LinkedIn</a>


## Electronic signatures that feel wonderfully human

---
</div>

### Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Contribution Guidelines](#contribution-guidelines)
6. [License](#license)
7. [Acknowledgments](#acknowledgments)

---
Please star ⭐ the repo to support us! 😀

### Introduction

Welcome to Signia, an electronic signature platform designed to provide a secure, reliable, and human-centered alternative to commercial e-sign platforms. Our mission is to make document signing feel wonderfully human while maintaining enterprise-grade security and compliance.

---

### Features

- **Secure PDF E-Signing:** With robust encryption algorithms, Signia ensures maximum security, privacy & compatibility.
- **Annotate Documents:** Signia allows you to annotate PDF documents with an advanced signing pad that supports hand drawn signatures, uploaded images, typed signatures & saved signatures.
- **User-Friendly Interface:** Signia was built with intuitive design in mind for ease of use. Features like "Sign yourself", "Templates", "One click signatures" and "Signia Drive" make it stand out.
- **Multi-signer Support:** Signia's ability to invite multiple signers for signing along with the ability to invite by sharing signing links & being able to enforce signing in a sequence.
- **Email Unique Code(OTP) verification support for guest signers:** With Signia, your documents are fully secure even when being signed by guest users.
- **"Expiring Docs" & "Rejection":** You can set documents to expire after certain number of days after which nobody will be able to sign.
- **Beautiful email templates:** All document signing invitations, completion notifications & reminders are formatted using great looking email templates.
- **PDF Template Creation:** Signia allows you to create and store PDF document templates for repeated use.
- **Signia Drive:** It is a centralized secure vault for your digital documents that makes storing, signing, organizing, sharing & archiving your docs a breeze.
- **Audit Trails & completion certificate:** Being a security focused solution, Signia makes it a top priority to save detailed logs for tracking document activities.
- **API Support:** Signia API allows seamless integration into existing systems and software.
- **Integrations:** The document signing experience becomes even more seamless because of integrations with various Cloud storage systems, CRMs & enterprise platforms.

---

### Deploy

Note: The default MongoDB instance used in deployment is not persistent and will be cleared on every restart. To retain your data, configure and supply your own MongoDB connection URL.

#### DigitalOcean
[![Deploy on DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/OpenSignLabs/Deploy-OpenSign-to-Digital-Ocean/tree/main&refcode=30db1c901ab0)

#### Docker
The simplest way to install Signia on your own server is using official docker images by running the following command -

**Command for linux/MacOS**
``` 
export HOST_URL=https://signia.yourdomain.com && curl --remote-name-all https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/docker-compose.yml https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/Caddyfile https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/.env.local_dev && mv .env.local_dev .env.prod && docker compose up --force-recreate
```
**Command for Windows (Powershell)**
```
$env:HOST_URL="https://signia.yourdomain.com"; Invoke-WebRequest -Uri https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/docker-compose.yml -OutFile docker-compose.yml; Invoke-WebRequest -Uri https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/Caddyfile -OutFile Caddyfile; Invoke-WebRequest -Uri https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/.env.local_dev -OutFile .env.local_dev; Rename-Item -Path .env.local_dev -NewName .env.prod; docker compose up --force-recreate
```
**Command for Windows (CMD/Terminal)**
```
set HOST_URL=https://signia.yourdomain.com && curl -O https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/docker-compose.yml && curl -O https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/Caddyfile && curl -O https://raw.githubusercontent.com/OpenSignLabs/OpenSign/main/.env.local_dev && rename .env.local_dev .env.prod && docker compose up --force-recreate
```
Make sure that you have `Docker` and `git` installed before you run this command -

Please refer to the [Installation Guide](https://docs.opensignlabs.com/docs/self-host/docker/run-locally/) for detailed instructions on how to install Signia on your system.

---

### Usage

For comprehensive guidelines on how to use Signia, please consult our [User Manual](USAGE.md).

---

### Contribution Guidelines

We welcome contributions from the open-source community. For more information on how to contribute, please read our [Contribution Guidelines](CONTRIBUTING.md).

---

### License

Signia is licensed under the AGPL-3 License. For more details, see the [LICENSE](LICENSE) file.

---

### Acknowledgments

We would like to thank all our contributors and users for their support and feedback.

---

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://aleksandarjakovljevic.com/"><img src="https://avatars.githubusercontent.com/u/2115393?v=4?s=100" width="100px;" alt="Aleksandar Jakovljevic"/><br /><sub><b>Aleksandar Jakovljevic</b></sub></a><br /><a href="#code-ajakov" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/BuilderPrid"><img src="https://avatars.githubusercontent.com/u/106882895?v=4?s=100" width="100px;" alt="Priyanshu Dwivedi"/><br /><sub><b>Priyanshu Dwivedi</b></sub></a><br /><a href="#code-BuilderPrid" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Tashuuuu"><img src="https://avatars.githubusercontent.com/u/85075827?v=4?s=100" width="100px;" alt="Akriti Sengar"/><br /><sub><b>Akriti Sengar</b></sub></a><br /><a href="#code-Tashuuuu" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/parthrc"><img src="https://avatars.githubusercontent.com/u/101104958?v=4?s=100" width="100px;" alt="Parth Chawande"/><br /><sub><b>Parth Chawande</b></sub></a><br /><a href="#code-parthrc" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Rishabh-git10"><img src="https://avatars.githubusercontent.com/u/107680241?v=4?s=100" width="100px;" alt="Rishabh Dewangan"/><br /><sub><b>Rishabh Dewangan</b></sub></a><br /><a href="#code-Rishabh-git10" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LemonDrop847"><img src="https://avatars.githubusercontent.com/u/106615670?v=4?s=100" width="100px;" alt="Nitin Mishra"/><br /><sub><b>Nitin Mishra</b></sub></a><br /><a href="#code-LemonDrop847" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://jobinselvanose.com"><img src="https://avatars.githubusercontent.com/u/63976083?v=4?s=100" width="100px;" alt="Jobin Selvanose"/><br /><sub><b>Jobin Selvanose</b></sub></a><br /><a href="#doc-Jobin-S" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/HansF"><img src="https://avatars.githubusercontent.com/u/1503?v=4?s=100" width="100px;" alt="Hans Fraiponts"/><br /><sub><b>Hans Fraiponts</b></sub></a><br /><a href="#doc-HansF" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://linktr.ee/monilprajapati"><img src="https://avatars.githubusercontent.com/u/99136041?v=4?s=100" width="100px;" alt="Monil Prajapati"/><br /><sub><b>Monil Prajapati</b></sub></a><br /><a href="#code-Monilprajapati" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://emm-dev0.github.io/portfolio/"><img src="https://avatars.githubusercontent.com/u/97445413?v=4?s=100" width="100px;" alt="Edogbanya Emmanuel"/><br /><sub><b>Edogbanya Emmanuel</b></sub></a><br /><a href="#bug-Emm-dev0" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pranav514"><img src="https://avatars.githubusercontent.com/u/76992202?v=4?s=100" width="100px;" alt="pranav514"/><br /><sub><b>pranav514</b></sub></a><br /><a href="#code-pranav514" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arianxq"><img src="https://avatars.githubusercontent.com/u/122199576?v=4?s=100" width="100px;" alt="Aria"/><br /><sub><b>Aria</b></sub></a><br /><a href="#code-arianxq" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SoumyadiptoPal"><img src="https://avatars.githubusercontent.com/u/119007659?v=4?s=100" width="100px;" alt="Soumyadipto Pal"/><br /><sub><b>Soumyadipto Pal</b></sub></a><br /><a href="#code-SoumyadiptoPal" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AndreyCurious"><img src="https://avatars.githubusercontent.com/u/105622604?v=4?s=100" width="100px;" alt="Andrey Didenko"/><br /><sub><b>Andrey Didenko</b></sub></a><br /><a href="#code-AndreyCurious" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/VishakhaSainani"><img src="https://avatars.githubusercontent.com/u/113436770?v=4?s=100" width="100px;" alt="VishakhaSainani"/><br /><sub><b>VishakhaSainani</b></sub></a><br /><a href="#code-VishakhaSainani" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/andrew-opensignlabs"><img src="https://avatars.githubusercontent.com/u/148278535?v=4?s=100" width="100px;" alt="Andrew"/><br /><sub><b>Andrew</b></sub></a><br /><a href="#code-andrew-opensignlabs" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rishabjasrotia"><img src="https://avatars.githubusercontent.com/u/33950743?v=4?s=100" width="100px;" alt="Rishab"/><br /><sub><b>Rishab</b></sub></a><br /><a href="#code-rishabjasrotia" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://session.it"><img src="https://avatars.githubusercontent.com/u/327285?v=4?s=100" width="100px;" alt="Maurizio Pillitu"/><br /><sub><b>Maurizio Pillitu</b></sub></a><br /><a href="#bug-maoo" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://luisparra.dev"><img src="https://avatars.githubusercontent.com/u/16653744?v=4?s=100" width="100px;" alt="Luis Parra"/><br /><sub><b>Luis Parra</b></sub></a><br /><a href="#a11y-lsprr" title="Accessibility">️️️️♿️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Govinda04"><img src="https://avatars.githubusercontent.com/u/50038172?v=4?s=100" width="100px;" alt="Govinda Kocharekar"/><br /><sub><b>Govinda Kocharekar</b></sub></a><br /><a href="#code-Govinda04" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://bilal.cc"><img src="https://avatars.githubusercontent.com/u/55330484?v=4?s=100" width="100px;" alt="Bilal Ahmad Bhat"/><br /><sub><b>Bilal Ahmad Bhat</b></sub></a><br /><a href="#code-crediblebilal" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/VikramNagwal"><img src="https://avatars.githubusercontent.com/u/123088024?v=4?s=100" width="100px;" alt="Vikram"/><br /><sub><b>Vikram</b></sub></a><br /><a href="#code-VikramNagwal" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ugoconsonni"><img src="https://avatars.githubusercontent.com/u/13661702?v=4?s=100" width="100px;" alt="ugoconsonni"/><br /><sub><b>ugoconsonni</b></sub></a><br /><a href="#code-ugoconsonni" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/daniel-mutwiri"><img src="https://avatars.githubusercontent.com/u/8936960?v=4?s=100" width="100px;" alt="Daniel Mutwiri"/><br /><sub><b>Daniel Mutwiri</b></sub></a><br /><a href="#code-daniel-mutwiri" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Zathiel"><img src="https://avatars.githubusercontent.com/u/26553418?v=4?s=100" width="100px;" alt="Zathiel"/><br /><sub><b>Zathiel</b></sub></a><br /><a href="#code-Zathiel" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/1024mb"><img src="https://avatars.githubusercontent.com/u/9301204?v=4?s=100" width="100px;" alt="1024mb"/><br /><sub><b>1024mb</b></sub></a><br /><a href="#translation-1024mb" title="Translation">🌍</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project is tested with BrowserStack.

