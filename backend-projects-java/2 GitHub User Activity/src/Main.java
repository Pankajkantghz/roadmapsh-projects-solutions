import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class Main {

    public static void main(String[] args) {

        if (args.length == 0) {
            System.out.println("Please provide a GitHub username.");
            return;
        }

        String username = args[0];
        String apiUrl = "https://api.github.com/users/" + username + "/events";

        try {
            String response = fetch(apiUrl);
            JSONArray events = new JSONArray(response);
            displayActivity(events);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    // ---------------- FETCH API ----------------
    static String fetch(String urlString) throws Exception {

        URL url = new URL(urlString);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();

        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "Java");

        if (con.getResponseCode() == 404) {
            throw new Exception("User not found.");
        }

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream())
        );

        String inputLine;
        StringBuilder content = new StringBuilder();

        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }

        in.close();
        return content.toString();
    }

    // ---------------- DISPLAY ----------------
    static void displayActivity(JSONArray events) {

        if (events.length() == 0) {
            System.out.println("No recent activity found.");
            return;
        }

        for (int i = 0; i < events.length(); i++) {

            JSONObject event = events.getJSONObject(i);
            String type = event.getString("type");
            String repo = event.getJSONObject("repo").getString("name");
            JSONObject payload = event.getJSONObject("payload");

            switch (type) {

                case "PushEvent": {
                    int count = payload.optInt("size", 0);

                    if (count > 0) {
                        System.out.println("- Pushed " + count + " commits to " + repo);
                    } else {
                        System.out.println("- Pushed commits to " + repo);
                    }
                    break;
                }

                case "IssuesEvent": {
                    String action = payload.getString("action");
                    System.out.println("- " + capitalize(action) + " an issue in " + repo);
                    break;
                }

                case "PullRequestEvent": {
                    String action = payload.getString("action");
                    System.out.println("- " + capitalize(action) + " a pull request in " + repo);
                    break;
                }

                case "WatchEvent":
                    System.out.println("- Starred " + repo);
                    break;

                case "ForkEvent":
                    System.out.println("- Forked " + repo);
                    break;

                case "CreateEvent": {
                    String refType = payload.getString("ref_type");
                    System.out.println("- Created " + refType + " in " + repo);
                    break;
                }

                case "IssueCommentEvent":
                    System.out.println("- Commented on an issue in " + repo);
                    break;

                default:
                    // ignore noisy events
                    break;
            }
        }
    }

    // ---------------- UTILITY ----------------
    static String capitalize(String word) {
        return word.substring(0,1).toUpperCase() + word.substring(1);
    }
}
