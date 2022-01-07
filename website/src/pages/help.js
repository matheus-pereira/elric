/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

import Translate from '@docusaurus/Translate';

// TODO legacy Docusaurus v1 components
import Container from '@site/src/components/v1/Container';
import GridBlock from '@site/src/components/v1/GridBlock';

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content: (
          <Translate>
            {`Find what you're looking for in our detailed documentation and guides.
- Learn how to [get started](/docs/getting-started) with elric.
- [Troubleshoot](/docs/troubleshooting) problems with elric.
- Learn how to [configure elric](/docs/configuration).
- Look at the full [API Reference](/docs/api).`}
          </Translate>
        ),
        title: <Translate>Browse the docs</Translate>,
      },
      {
        content: (
          <Translate>
            {`Ask questions and find answers from other elric users like you.
- Join the \`#testing\` channel on [Reactiflux](https://www.reactiflux.com/), a Discord community.
- Many members of the community use Stack Overflow. Read through the [existing questions](https://stackoverflow.com/questions/tagged/elricjs) tagged with **elricjs** or [ask your own](https://stackoverflow.com/questions/ask)!`}
          </Translate>
        ),
        title: <Translate>Join the community</Translate>,
      },
      {
        content: (
          <Translate>
            {`Find out what's new with elric.
- Follow [elric](https://twitter.com/fbelric) on Twitter.
- Subscribe to the [elric blog](/blog/).
- Look at the [changelog](https://github.com/facebook/elric/blob/main/CHANGELOG.md).`}
          </Translate>
        ),
        title: <Translate>Stay up to date</Translate>,
      },
    ];

    return (
      <div className="wrapperV1">
        <Container className="mainContainerV1">
          <div className="padding-vert--lg">
            <div>
              <header>
                <h2>
                  <Translate>Need help?</Translate>
                </h2>
              </header>
              <p>
                <Translate>
                  elric is worked on by a team of volunteers in their spare time.
                  You can find out ways to talk to community members below.
                </Translate>
              </p>
            </div>
            <div className="padding-top--md">
              <GridBlock contents={supportLinks} layout="threeColumn" />
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default function HelpPage(props) {
  return (
    <Layout>
      <Help {...props} />
    </Layout>
  );
}
