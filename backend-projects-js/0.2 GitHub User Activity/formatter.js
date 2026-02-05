export function displayActivity(events) {
  if (!events.length) {
    console.log("No recent activity found.");
    return;
  }

  for (const event of events) {
    const repo = event.repo.name;

    switch (event.type) {

      case "PushEvent": {
        const count =
          event.payload.size ??
          event.payload.commits?.length ??
          0;

        if (count > 0) {
          console.log(`- Pushed ${count} commits to ${repo}`);
        } else {
          console.log(`- Pushed commits to ${repo}`);
        }
        break;
      }

      case "IssuesEvent":
        if (event.payload.action === "opened") {
          console.log(`- Opened a new issue in ${repo}`);
        } else {
          console.log(`- ${capitalize(event.payload.action)} an issue in ${repo}`);
        }
        break;

      case "PullRequestEvent":
        if (event.payload.action === "opened") {
          console.log(`- Opened a pull request in ${repo}`);
        } else {
          console.log(`- ${capitalize(event.payload.action)} a pull request in ${repo}`);
        }
        break;

      case "WatchEvent":
        console.log(`- Starred ${repo}`);
        break;

      case "ForkEvent":
        console.log(`- Forked ${repo}`);
        break;

      case "CreateEvent":
        console.log(`- Created ${event.payload.ref_type} in ${repo}`);
        break;

      case "IssueCommentEvent":
        console.log(`- Commented on an issue in ${repo}`);
        break;

      default:
        
        break;
    }
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
