const expectedCommit = String(
  process.env.EXPECTED_COMMIT_SHA || ''
).trim().toLowerCase();

const deploymentUrl = String(
  process.env.DEPLOYMENT_MARKER_URL ||
  'https://routineforge.tech/routineforge-deployment.json'
).trim();

const attempts = Number(
  process.env.DEPLOYMENT_WAIT_ATTEMPTS || 40
);

const delaySeconds = Number(
  process.env.DEPLOYMENT_WAIT_SECONDS || 15
);

if (!/^[0-9a-f]{40}$/.test(expectedCommit)) {
  throw new Error('EXPECTED_COMMIT_SHA must be a full Git commit SHA.');
}

if (!Number.isInteger(attempts) || attempts < 1) {
  throw new Error('DEPLOYMENT_WAIT_ATTEMPTS must be a positive integer.');
}

if (!Number.isFinite(delaySeconds) || delaySeconds < 1) {
  throw new Error('DEPLOYMENT_WAIT_SECONDS must be at least one second.');
}

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const url = new URL(deploymentUrl);
    url.searchParams.set('expected', expectedCommit);
    url.searchParams.set('attempt', String(attempt));

    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'cache-control': 'no-cache'
      },
      redirect: 'error',
      signal: AbortSignal.timeout(10_000)
    });

    if (response.ok) {
      const marker = await response.json();
      const deployedCommit = String(
        marker.commit || ''
      ).trim().toLowerCase();

      if (deployedCommit === expectedCommit) {
        console.log(
          `Production is serving commit ${expectedCommit}.`
        );
        process.exit(0);
      }

      console.log(
        `Attempt ${attempt}/${attempts}: production is serving ` +
        `${deployedCommit || 'an unknown commit'}.`
      );
    } else {
      console.log(
        `Attempt ${attempt}/${attempts}: marker returned HTTP ` +
        `${response.status}.`
      );
    }
  } catch (error) {
    console.log(
      `Attempt ${attempt}/${attempts}: ${error.message}`
    );
  }

  if (attempt < attempts) {
    await wait(delaySeconds * 1000);
  }
}

throw new Error(
  `Production did not reach commit ${expectedCommit} within ` +
  `${attempts * delaySeconds} seconds.`
);
