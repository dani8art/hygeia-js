/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const siteConfig = require(`${CWD}/siteConfig.js`);
const versions = require(`${CWD}/versions.json`);

function Versions() {
  const latestVersion = versions[0];
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`;
  const releasesUrl = `${repoUrl}/releases`;
  const latestReleaseUrl = `${releasesUrl}/tag/${latestVersion}`;
  const preReleaseDocsUrl = `${repoUrl}/tree/develop`;

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1 class="postHeaderTitle">{siteConfig.title} Versions</h1>
          </header>
          <p>New versions of this project are released every so often.</p>
          <h3 id="latest">Current version (Stable)</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a href="/docs/gs-installation.html">Documentation</a>
                </td>
                <td>
                  <a href={latestReleaseUrl}>Release Notes</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            This is the version that is configured automatically when you first
            install this project.
          </p>
          <h3 id="rc">Pre-release versions</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>next</th>
                <td>
                  <a href={preReleaseDocsUrl}>Documentation</a>
                </td>
                <td>
                  <a href={releasesUrl}>Release Notes</a>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Next version is the edge version of hygeia-js which is in continuous development and could contain some bugs.</p>
          <h3 id="archive">Past Versions</h3>
          <table className="versions">
            <tbody>
              {versions.map(version => {
                const pastReleaseDocsUrl = `/docs/${version}/gs-installation.html`;
                const pastReleaseUrl = `${releasesUrl}/tag/${version}`;
                return version !== latestVersion && (
                  <tr>
                    <th>{version}</th>
                    <td>
                      <a href={pastReleaseDocsUrl}>Documentation</a>
                    </td>
                    <td>
                      <a href={pastReleaseUrl}>Release Notes</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on{' '}
            <a href={repoUrl}>GitHub</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Versions;
