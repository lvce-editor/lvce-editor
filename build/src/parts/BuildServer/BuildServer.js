import { readdir } from 'fs/promises'
import * as BundleCss from '../BundleCss/BundleCss.js'
import * as BundleRendererProcessCached from '../BundleRendererProcessCached/BundleRendererProcessCached.js'
import * as BundleRendererWorkerCached from '../BundleRendererWorkerCached/BundleRendererWorkerCached.js'
import * as CommitHash from '../CommitHash/CommitHash.js'
import * as Console from '../Console/Console.js'
import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'
import * as Replace from '../Replace/Replace.js'
import * as Tag from '../Tag/Tag.js'
import * as WriteFile from '../WriteFile/WriteFile.js'

const copyStaticFiles = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await Copy.copy({
    from: 'static/config',
    to: `build/.tmp/server/server/static/${commitHash}/config`,
  })
  await Copy.copy({
    from: 'static/js',
    to: `build/.tmp/server/server/static/${commitHash}/static/js`,
  })
  await Copy.copyFile({
    from: 'static/favicon.ico',
    to: `build/.tmp/server/server/static/favicon.ico`,
  })
  await Copy.copyFile({
    from: 'static/serviceWorker.js',
    to: `build/.tmp/server/server/static/serviceWorker.js`,
  })
  await Copy.copy({
    from: 'static/fonts',
    to: `build/.tmp/server/server/static/${commitHash}/fonts`,
  })
  await Copy.copy({
    from: 'static/images',
    to: `build/.tmp/server/server/static/images`,
  })
  await Copy.copy({
    from: 'static/sounds',
    to: `build/.tmp/server/server/static/${commitHash}/sounds`,
  })
  await Copy.copyFile({
    from: 'static/manifest.json',
    to: `build/.tmp/server/server/static/manifest.json`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/manifest.json`,
    occurrence: '/icons',
    replacement: `/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/serviceWorker.js`,
    occurrence: `const CACHE_STATIC_NAME = 'static-v4'`,
    replacement: `const CACHE_STATIC_NAME = 'static-${commitHash}'`,
  })
  await Copy.copyFile({
    from: 'static/index.html',
    to: `build/.tmp/server/server/static/index.html`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/config',
    replacement: `/${commitHash}/config`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '</head>',
    replacement: `  <link rel="preload" href="/${commitHash}/config/defaultSettings.json" as="fetch" crossorigin>
  </head>`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '</body>',
    replacement: `  <script>
// set background colors to avoid white flash on firefox
const px = value => {
  return \`\${value}px\`
}

const getLayout = () => {
  const layoutItem = localStorage.getItem('layout')
  if(!layoutItem){
    return undefined
  }
  try {
    return JSON.parse(layoutItem)
  } catch {
    return undefined
  }
}

const preload = () => {
  const layout = getLayout()
  if(!layout){
    return
  }

  const $ActivityBar = document.createElement('div')
  $ActivityBar.style.left = px(layout.activityBarLeft)
  $ActivityBar.style.top = px(layout.activityBarTop)
  $ActivityBar.style.width = px(layout.activityBarWidth)
  $ActivityBar.style.height = px(layout.activityBarHeight)
  $ActivityBar.style.background = 'rgb(41, 48, 48)'
  $ActivityBar.style.position = 'fixed'

  const $Main = document.createElement('div')
  $Main.style.left = px(layout.mainLeft)
  $Main.style.top = px(layout.mainTop)
  $Main.style.width = px(layout.mainWidth)
  $Main.style.height = px(layout.mainHeight)
  $Main.style.background = '#1e2324'
  $Main.style.position = 'fixed'

  const $TitleBar = document.createElement('div')
  $TitleBar.style.top = px(layout.titleBarTop)
  $TitleBar.style.left = px(layout.titleBarLeft)
  $TitleBar.style.width = px(layout.titleBarWidth)
  $TitleBar.style.height = px(layout.titleBarHeight)
  $TitleBar.style.background = 'rgb(40, 46, 47)'
  $TitleBar.style.position = 'fixed'

  const $StatusBar = document.createElement('div')
  $StatusBar.style.top = px(layout.statusBarTop)
  $StatusBar.style.left = px(layout.statusBarLeft)
  $StatusBar.style.width = px(layout.statusBarWidth)
  $StatusBar.style.height = px(layout.statusBarHeight)
  $StatusBar.style.background = 'black'
  $StatusBar.style.position = 'fixed'

  const $SideBar = document.createElement('div')
  $SideBar.style.top = px(layout.sideBarTop)
  $SideBar.style.left = px(layout.sideBarLeft)
  $SideBar.style.width = px(layout.sideBarWidth)
  $SideBar.style.height = px(layout.sideBarHeight)
  $SideBar.style.background = '#1b2020'
  $SideBar.style.position = 'fixed'

  const $Preload = document.createElement('div')
  $Preload.style.position = 'fixed'
  $Preload.style.zIndex=1
  $Preload.append($TitleBar, $Main, $SideBar, $ActivityBar, $StatusBar)

  document.body.append($Preload)

  window.addEventListener('load', () => {
    requestIdleCallback(()=>{
      $Preload.remove()
    })
  })
}

preload()
    </script>
  </body>`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/packages/renderer-process/src/rendererProcessMain.js',
    replacement: `/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/packages/renderer-worker/src/rendererWorkerMain.js',
    replacement: `/${commitHash}/packages/renderer-worker/dist/rendererWorkerMain.js`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/icons',
    replacement: `/${commitHash}/icons`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/css',
    replacement: `/${commitHash}/css`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/index.html`,
    occurrence: '/fonts',
    replacement: `/${commitHash}/fonts`,
  })
  await BundleCss.bundleCss({
    to: `build/.tmp/server/server/static/${commitHash}/css/App.css`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/css/App.css`,
    occurrence: `url(/icons/`,
    replacement: `url(/${commitHash}/icons/`,
  })
  await Replace.replace({
    path: `build/.tmp/server/server/static/${commitHash}/css/App.css`,
    occurrence: `url(/fonts/`,
    replacement: `url(/${commitHash}/fonts/`,
  })
  await Copy.copy({
    from: 'static/icons',
    to: `build/.tmp/server/server/static/${commitHash}/icons`,
  })
}

const getObjectDependencies = (obj) => {
  if (!obj || !obj.dependencies) {
    return []
  }
  return [
    obj,
    ...Object.values(obj.dependencies).flatMap(getObjectDependencies),
  ]
}

const copySharedProcessFiles = async () => {
  await Copy.copy({
    from: 'packages/shared-process',
    to: 'build/.tmp/server/shared-process',
    ignore: [
      'node_modules',
      '.nvmrc',
      'tsconfig.json',
      'package-lock.json',
      'test',
    ],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/shared-process/LICENSE',
  })
  await Copy.copy({
    from: 'static/config',
    to: 'build/.tmp/server/shared-process/config',
  })
  await Replace.replace({
    path: 'build/.tmp/server/shared-process/src/parts/Root/Root.js',
    occurrence: `export const root = resolve(__dirname, '../../../../../')`,
    replacement: `export const root = resolve(__dirname, '../../../')`,
  })
  await Replace.replace({
    path: 'build/.tmp/server/shared-process/src/parts/Platform/Platform.js',
    occurrence: `Path.join(getAppDir(), 'static', 'config', 'defaultSettings.json')`,
    replacement: `Path.join(Root.root, 'config', 'defaultSettings.json')`,
  })
  await Replace.replace({
    path: 'build/.tmp/server/shared-process/src/parts/Env/Env.js',
    occurrence: `return process.env.FOLDER`,
    replacement: `return process.env.FOLDER || process.cwd()`,
  })
  // TODO where should builtinExtension be located?
  const shouldBeCopied = (extensionName) => {
    return (
      extensionName === 'builtin.theme-slime' ||
      extensionName === 'builtin.vscode-icons' ||
      extensionName.startsWith('builtin.language-basics')
    )
  }
  const extensionNames = await readdir(Path.absolute('extensions'))
  for (const extensionName of extensionNames) {
    if (shouldBeCopied(extensionName)) {
      await Copy.copy({
        from: `extensions/${extensionName}`,
        to: `build/.tmp/server/shared-process/extensions/${extensionName}`,
      })
    }
  }
}

const copyServerFiles = async () => {
  const commitHash = await CommitHash.getCommitHash()
  await Copy.copy({
    from: 'packages/server',
    to: 'build/.tmp/server/server',
    ignore: ['tsconfig.json', 'node_modules', 'package-lock.json'],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/server/LICENSE',
  })
  await Replace.replace({
    path: 'build/.tmp/server/server/src/server.js',
    occurrence: `const STATIC = resolve(__dirname, '../../../static')`,
    replacement: `const STATIC = resolve(__dirname, '../static')`,
  })
  await Replace.replace({
    path: 'build/.tmp/server/server/src/server.js',
    occurrence: `const ROOT = resolve(__dirname, '../../../')`,
    replacement: `const ROOT = resolve(__dirname, '../')`,
  })
  const content = `This project incorporates components from the projects listed below, that may have licenses
differing from this project:


1) License Notice for static/${commitHash}/icons (from https://github.com/microsoft/vscode-icons)
---------------------------------------

Attribution 4.0 International

=======================================================================

Creative Commons Corporation ("Creative Commons") is not a law firm and
does not provide legal services or legal advice. Distribution of
Creative Commons public licenses does not create a lawyer-client or
other relationship. Creative Commons makes its licenses and related
information available on an "as-is" basis. Creative Commons gives no
warranties regarding its licenses, any material licensed under their
terms and conditions, or any related information. Creative Commons
disclaims all liability for damages resulting from their use to the
fullest extent possible.

Using Creative Commons Public Licenses

Creative Commons public licenses provide a standard set of terms and
conditions that creators and other rights holders may use to share
original works of authorship and other material subject to copyright
and certain other rights specified in the public license below. The
following considerations are for informational purposes only, are not
exhaustive, and do not form part of our licenses.

     Considerations for licensors: Our public licenses are
     intended for use by those authorized to give the public
     permission to use material in ways otherwise restricted by
     copyright and certain other rights. Our licenses are
     irrevocable. Licensors should read and understand the terms
     and conditions of the license they choose before applying it.
     Licensors should also secure all rights necessary before
     applying our licenses so that the public can reuse the
     material as expected. Licensors should clearly mark any
     material not subject to the license. This includes other CC-
     licensed material, or material used under an exception or
     limitation to copyright. More considerations for licensors:
	wiki.creativecommons.org/Considerations_for_licensors

     Considerations for the public: By using one of our public
     licenses, a licensor grants the public permission to use the
     licensed material under specified terms and conditions. If
     the licensor's permission is not necessary for any reason--for
     example, because of any applicable exception or limitation to
     copyright--then that use is not regulated by the license. Our
     licenses grant only permissions under copyright and certain
     other rights that a licensor has authority to grant. Use of
     the licensed material may still be restricted for other
     reasons, including because others have copyright or other
     rights in the material. A licensor may make special requests,
     such as asking that all changes be marked or described.
     Although not required by our licenses, you are encouraged to
     respect those requests where reasonable. More_considerations
     for the public:
	wiki.creativecommons.org/Considerations_for_licensees

=======================================================================

Creative Commons Attribution 4.0 International Public License

By exercising the Licensed Rights (defined below), You accept and agree
to be bound by the terms and conditions of this Creative Commons
Attribution 4.0 International Public License ("Public License"). To the
extent this Public License may be interpreted as a contract, You are
granted the Licensed Rights in consideration of Your acceptance of
these terms and conditions, and the Licensor grants You such rights in
consideration of benefits the Licensor receives from making the
Licensed Material available under these terms and conditions.


Section 1 -- Definitions.

  a. Adapted Material means material subject to Copyright and Similar
     Rights that is derived from or based upon the Licensed Material
     and in which the Licensed Material is translated, altered,
     arranged, transformed, or otherwise modified in a manner requiring
     permission under the Copyright and Similar Rights held by the
     Licensor. For purposes of this Public License, where the Licensed
     Material is a musical work, performance, or sound recording,
     Adapted Material is always produced where the Licensed Material is
     synched in timed relation with a moving image.

  b. Adapter's License means the license You apply to Your Copyright
     and Similar Rights in Your contributions to Adapted Material in
     accordance with the terms and conditions of this Public License.

  c. Copyright and Similar Rights means copyright and/or similar rights
     closely related to copyright including, without limitation,
     performance, broadcast, sound recording, and Sui Generis Database
     Rights, without regard to how the rights are labeled or
     categorized. For purposes of this Public License, the rights
     specified in Section 2(b)(1)-(2) are not Copyright and Similar
     Rights.

  d. Effective Technological Measures means those measures that, in the
     absence of proper authority, may not be circumvented under laws
     fulfilling obligations under Article 11 of the WIPO Copyright
     Treaty adopted on December 20, 1996, and/or similar international
     agreements.

  e. Exceptions and Limitations means fair use, fair dealing, and/or
     any other exception or limitation to Copyright and Similar Rights
     that applies to Your use of the Licensed Material.

  f. Licensed Material means the artistic or literary work, database,
     or other material to which the Licensor applied this Public
     License.

  g. Licensed Rights means the rights granted to You subject to the
     terms and conditions of this Public License, which are limited to
     all Copyright and Similar Rights that apply to Your use of the
     Licensed Material and that the Licensor has authority to license.

  h. Licensor means the individual(s) or entity(ies) granting rights
     under this Public License.

  i. Share means to provide material to the public by any means or
     process that requires permission under the Licensed Rights, such
     as reproduction, public display, public performance, distribution,
     dissemination, communication, or importation, and to make material
     available to the public including in ways that members of the
     public may access the material from a place and at a time
     individually chosen by them.

  j. Sui Generis Database Rights means rights other than copyright
     resulting from Directive 96/9/EC of the European Parliament and of
     the Council of 11 March 1996 on the legal protection of databases,
     as amended and/or succeeded, as well as other essentially
     equivalent rights anywhere in the world.

  k. You means the individual or entity exercising the Licensed Rights
     under this Public License. Your has a corresponding meaning.


Section 2 -- Scope.

  a. License grant.

       1. Subject to the terms and conditions of this Public License,
          the Licensor hereby grants You a worldwide, royalty-free,
          non-sublicensable, non-exclusive, irrevocable license to
          exercise the Licensed Rights in the Licensed Material to:

            a. reproduce and Share the Licensed Material, in whole or
               in part; and

            b. produce, reproduce, and Share Adapted Material.

       2. Exceptions and Limitations. For the avoidance of doubt, where
          Exceptions and Limitations apply to Your use, this Public
          License does not apply, and You do not need to comply with
          its terms and conditions.

       3. Term. The term of this Public License is specified in Section
          6(a).

       4. Media and formats; technical modifications allowed. The
          Licensor authorizes You to exercise the Licensed Rights in
          all media and formats whether now known or hereafter created,
          and to make technical modifications necessary to do so. The
          Licensor waives and/or agrees not to assert any right or
          authority to forbid You from making technical modifications
          necessary to exercise the Licensed Rights, including
          technical modifications necessary to circumvent Effective
          Technological Measures. For purposes of this Public License,
          simply making modifications authorized by this Section 2(a)
          (4) never produces Adapted Material.

       5. Downstream recipients.

            a. Offer from the Licensor -- Licensed Material. Every
               recipient of the Licensed Material automatically
               receives an offer from the Licensor to exercise the
               Licensed Rights under the terms and conditions of this
               Public License.

            b. No downstream restrictions. You may not offer or impose
               any additional or different terms or conditions on, or
               apply any Effective Technological Measures to, the
               Licensed Material if doing so restricts exercise of the
               Licensed Rights by any recipient of the Licensed
               Material.

       6. No endorsement. Nothing in this Public License constitutes or
          may be construed as permission to assert or imply that You
          are, or that Your use of the Licensed Material is, connected
          with, or sponsored, endorsed, or granted official status by,
          the Licensor or others designated to receive attribution as
          provided in Section 3(a)(1)(A)(i).

  b. Other rights.

       1. Moral rights, such as the right of integrity, are not
          licensed under this Public License, nor are publicity,
          privacy, and/or other similar personality rights; however, to
          the extent possible, the Licensor waives and/or agrees not to
          assert any such rights held by the Licensor to the limited
          extent necessary to allow You to exercise the Licensed
          Rights, but not otherwise.

       2. Patent and trademark rights are not licensed under this
          Public License.

       3. To the extent possible, the Licensor waives any right to
          collect royalties from You for the exercise of the Licensed
          Rights, whether directly or through a collecting society
          under any voluntary or waivable statutory or compulsory
          licensing scheme. In all other cases the Licensor expressly
          reserves any right to collect such royalties.


Section 3 -- License Conditions.

Your exercise of the Licensed Rights is expressly made subject to the
following conditions.

  a. Attribution.

       1. If You Share the Licensed Material (including in modified
          form), You must:

            a. retain the following if it is supplied by the Licensor
               with the Licensed Material:

                 i. identification of the creator(s) of the Licensed
                    Material and any others designated to receive
                    attribution, in any reasonable manner requested by
                    the Licensor (including by pseudonym if
                    designated);

                ii. a copyright notice;

               iii. a notice that refers to this Public License;

                iv. a notice that refers to the disclaimer of
                    warranties;

                 v. a URI or hyperlink to the Licensed Material to the
                    extent reasonably practicable;

            b. indicate if You modified the Licensed Material and
               retain an indication of any previous modifications; and

            c. indicate the Licensed Material is licensed under this
               Public License, and include the text of, or the URI or
               hyperlink to, this Public License.

       2. You may satisfy the conditions in Section 3(a)(1) in any
          reasonable manner based on the medium, means, and context in
          which You Share the Licensed Material. For example, it may be
          reasonable to satisfy the conditions by providing a URI or
          hyperlink to a resource that includes the required
          information.

       3. If requested by the Licensor, You must remove any of the
          information required by Section 3(a)(1)(A) to the extent
          reasonably practicable.

       4. If You Share Adapted Material You produce, the Adapter's
          License You apply must not prevent recipients of the Adapted
          Material from complying with this Public License.


Section 4 -- Sui Generis Database Rights.

Where the Licensed Rights include Sui Generis Database Rights that
apply to Your use of the Licensed Material:

  a. for the avoidance of doubt, Section 2(a)(1) grants You the right
     to extract, reuse, reproduce, and Share all or a substantial
     portion of the contents of the database;

  b. if You include all or a substantial portion of the database
     contents in a database in which You have Sui Generis Database
     Rights, then the database in which You have Sui Generis Database
     Rights (but not its individual contents) is Adapted Material; and

  c. You must comply with the conditions in Section 3(a) if You Share
     all or a substantial portion of the contents of the database.

For the avoidance of doubt, this Section 4 supplements and does not
replace Your obligations under this Public License where the Licensed
Rights include other Copyright and Similar Rights.


Section 5 -- Disclaimer of Warranties and Limitation of Liability.

  a. UNLESS OTHERWISE SEPARATELY UNDERTAKEN BY THE LICENSOR, TO THE
     EXTENT POSSIBLE, THE LICENSOR OFFERS THE LICENSED MATERIAL AS-IS
     AND AS-AVAILABLE, AND MAKES NO REPRESENTATIONS OR WARRANTIES OF
     ANY KIND CONCERNING THE LICENSED MATERIAL, WHETHER EXPRESS,
     IMPLIED, STATUTORY, OR OTHER. THIS INCLUDES, WITHOUT LIMITATION,
     WARRANTIES OF TITLE, MERCHANTABILITY, FITNESS FOR A PARTICULAR
     PURPOSE, NON-INFRINGEMENT, ABSENCE OF LATENT OR OTHER DEFECTS,
     ACCURACY, OR THE PRESENCE OR ABSENCE OF ERRORS, WHETHER OR NOT
     KNOWN OR DISCOVERABLE. WHERE DISCLAIMERS OF WARRANTIES ARE NOT
     ALLOWED IN FULL OR IN PART, THIS DISCLAIMER MAY NOT APPLY TO YOU.

  b. TO THE EXTENT POSSIBLE, IN NO EVENT WILL THE LICENSOR BE LIABLE
     TO YOU ON ANY LEGAL THEORY (INCLUDING, WITHOUT LIMITATION,
     NEGLIGENCE) OR OTHERWISE FOR ANY DIRECT, SPECIAL, INDIRECT,
     INCIDENTAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY, OR OTHER LOSSES,
     COSTS, EXPENSES, OR DAMAGES ARISING OUT OF THIS PUBLIC LICENSE OR
     USE OF THE LICENSED MATERIAL, EVEN IF THE LICENSOR HAS BEEN
     ADVISED OF THE POSSIBILITY OF SUCH LOSSES, COSTS, EXPENSES, OR
     DAMAGES. WHERE A LIMITATION OF LIABILITY IS NOT ALLOWED IN FULL OR
     IN PART, THIS LIMITATION MAY NOT APPLY TO YOU.

  c. The disclaimer of warranties and limitation of liability provided
     above shall be interpreted in a manner that, to the extent
     possible, most closely approximates an absolute disclaimer and
     waiver of all liability.


Section 6 -- Term and Termination.

  a. This Public License applies for the term of the Copyright and
     Similar Rights licensed here. However, if You fail to comply with
     this Public License, then Your rights under this Public License
     terminate automatically.

  b. Where Your right to use the Licensed Material has terminated under
     Section 6(a), it reinstates:

       1. automatically as of the date the violation is cured, provided
          it is cured within 30 days of Your discovery of the
          violation; or

       2. upon express reinstatement by the Licensor.

     For the avoidance of doubt, this Section 6(b) does not affect any
     right the Licensor may have to seek remedies for Your violations
     of this Public License.

  c. For the avoidance of doubt, the Licensor may also offer the
     Licensed Material under separate terms or conditions or stop
     distributing the Licensed Material at any time; however, doing so
     will not terminate this Public License.

  d. Sections 1, 5, 6, 7, and 8 survive termination of this Public
     License.


Section 7 -- Other Terms and Conditions.

  a. The Licensor shall not be bound by any additional or different
     terms or conditions communicated by You unless expressly agreed.

  b. Any arrangements, understandings, or agreements regarding the
     Licensed Material not stated herein are separate from and
     independent of the terms and conditions of this Public License.


Section 8 -- Interpretation.

  a. For the avoidance of doubt, this Public License does not, and
     shall not be interpreted to, reduce, limit, restrict, or impose
     conditions on any use of the Licensed Material that could lawfully
     be made without permission under this Public License.

  b. To the extent possible, if any provision of this Public License is
     deemed unenforceable, it shall be automatically reformed to the
     minimum extent necessary to make it enforceable. If the provision
     cannot be reformed, it shall be severed from this Public License
     without affecting the enforceability of the remaining terms and
     conditions.

  c. No term or condition of this Public License will be waived and no
     failure to comply consented to unless expressly agreed to by the
     Licensor.

  d. Nothing in this Public License constitutes or may be interpreted
     as a limitation upon, or waiver of, any privileges and immunities
     that apply to the Licensor or You, including from the legal
     processes of any jurisdiction or authority.


=======================================================================

Creative Commons is not a party to its public
licenses. Notwithstanding, Creative Commons may elect to apply one of
its public licenses to material it publishes and in those instances
will be considered the “Licensor.” The text of the Creative Commons
public licenses is dedicated to the public domain under the CC0 Public
Domain Dedication. Except for the limited purpose of indicating that
material is shared under a Creative Commons public license or as
otherwise permitted by the Creative Commons policies published at
creativecommons.org/policies, Creative Commons does not authorize the
use of the trademark "Creative Commons" or any other trademark or logo
of Creative Commons without its prior written consent including,
without limitation, in connection with any unauthorized modifications
to any of its public licenses or any other arrangements,
understandings, or agreements concerning use of licensed material. For
the avoidance of doubt, this paragraph does not form part of the
public licenses.

Creative Commons may be contacted at creativecommons.org.


2) License Notice for static/${commitHash}/fonts/FiraCode-VariableFont.ttf (from https://github.com/tonsky/FiraCode)
---------------------------------------

Copyright (c) 2014, The Fira Code Project Authors (https://github.com/tonsky/FiraCode)

This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`
  await WriteFile.writeFile({
    to: 'build/.tmp/server/server/ThirdPartyNotices.txt',
    content,
  })
}

const copyExtensionHostFiles = async () => {
  await Copy.copy({
    from: 'packages/extension-host',
    to: 'build/.tmp/server/extension-host',
    ignore: [
      'tsconfig.json',
      'node_modules',
      'distmin',
      'example',
      'test',
      'package-lock.json',
    ],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/extension-host/LICENSE',
  })
}

const copyPtyHostFiles = async () => {
  await Copy.copy({
    from: 'packages/pty-host',
    to: 'build/.tmp/server/pty-host',
    ignore: [
      'tsconfig.json',
      'node_modules',
      'distmin',
      'example',
      'test',
      '.nvmrc',
      'package-lock.json',
    ],
  })
  await Copy.copyFile({
    from: 'LICENSE',
    to: 'build/.tmp/server/pty-host/LICENSE',
  })
}

const setVersions = async () => {
  const gitTag = await Tag.getGitTag()
  const files = [
    'build/.tmp/server/extension-host/package.json',
    'build/.tmp/server/pty-host/package.json',
    'build/.tmp/server/server/package.json',
    'build/.tmp/server/shared-process/package.json',
  ]
  for (const file of files) {
    const json = await JsonFile.readJson(file)
    if (json.dependencies && json.dependencies['@lvce-editor/shared-process']) {
      json.dependencies['@lvce-editor/shared-process'] = gitTag
    }
    if (json.dependencies && json.dependencies['@lvce-editor/pty-host']) {
      json.dependencies['@lvce-editor/pty-host'] = gitTag
    }
    if (json.dependencies && json.dependencies['@lvce-editor/extension-host']) {
      json.dependencies['@lvce-editor/extension-host'] = gitTag
    }
    if (json.version) {
      json.version = gitTag
    }
    await JsonFile.writeJson({
      to: file,
      value: json,
    })
  }
}

const bundleRendererWorkerAndRendererProcessJs = async () => {
  const commitHash = await CommitHash.getCommitHash()
  const rendererProcessCachePath =
    await BundleRendererProcessCached.bundleRendererProcessCached({
      commitHash,
      platform: 'remote',
    })

  console.time('copyRendererProcessFiles')
  await Copy.copy({
    from: rendererProcessCachePath,
    to: `build/.tmp/server/server/static/${commitHash}/packages/renderer-process`,
    ignore: ['static'],
  })
  console.timeEnd('copyRendererProcessFiles')

  const rendererWorkerCachePath =
    await BundleRendererWorkerCached.bundleRendererWorkerCached({
      commitHash,
      platform: 'remote',
    })

  console.time('copyRendererWorkerFiles')
  await Copy.copy({
    from: rendererWorkerCachePath,
    to: `build/.tmp/server/server/static/${commitHash}/packages/renderer-worker`,
    ignore: ['static'],
  })
  console.timeEnd('copyRendererWorkerFiles')
}

export const build = async () => {
  Console.time('clean')
  await Remove.remove('build/.tmp/server')
  Console.timeEnd('clean')

  console.time('copyServerFiles')
  await copyServerFiles()
  console.timeEnd('copyServerFiles')

  console.time('copyStaticFiles')
  await copyStaticFiles()
  console.timeEnd('copyStaticFiles')

  console.time('bundleRendererWorkerAndRendererProcessJs')
  await bundleRendererWorkerAndRendererProcessJs()
  console.timeEnd('bundleRendererWorkerAndRendererProcessJs')

  console.time('copySharedProcessFiles')
  await copySharedProcessFiles()
  console.timeEnd('copySharedProcessFiles')

  console.time('copyExtensionHostFiles')
  await copyExtensionHostFiles()
  console.timeEnd('copyExtensionHostFiles')

  console.time('copyPtyHostFiles')
  await copyPtyHostFiles()
  console.timeEnd('copyPtyHostFiles')

  console.time('setVersions')
  await setVersions()
  console.timeEnd('setVersions')
}
