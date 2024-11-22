const apiUrl = "https://zone01normandie.org/api";

document.getElementById("login-button").addEventListener("click", async () => {
  const usernameEmail = document.getElementById("username-email").value;
  const password = document.getElementById("password").value;
  const loginError = document.getElementById("login-error");

  if (!usernameEmail || !password) {
    loginError.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const credentials = btoa(`${usernameEmail}:${password}`);
    const response = await fetch(`${apiUrl}/auth/signin`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid credentials.");
    }

    const jwt = await response.json();
    sessionStorage.setItem("jwt", jwt);
    showProfilePage();
  } catch (error) {
    loginError.textContent = error.message;
  }
});

function showProfilePage() {
  document.getElementById("login-page").style.display = "none";
  document.getElementById("profile-page").style.display = "block";

  fetchUserData();
}

async function fetchUserData() {
  const jwt = sessionStorage.getItem("jwt");

  if (!jwt) {
    alert("You must log in first.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/graphql-engine/v1/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        query: `
          query {
            user {
              id
              login
            }
          }
        `,
      }),
    });

    const data = await response.json();
    const userInfo = data.data.user[0];
    document.getElementById("user-info").textContent = `ID: ${userInfo.id}, Login: ${userInfo.login}`;
    renderGraphs(userInfo.id);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function renderGraphs(userId) {
  const graph1 = document.getElementById("graph1");
  const graph2 = document.getElementById("graph2");

  // Example static graph data (replace with dynamic GraphQL queries)
  const xpData = [100, 200, 150, 300, 250];
  const projectStats = [3, 1]; // Pass, Fail

  renderBarGraph(graph1, xpData);
  renderPieChart(graph2, projectStats);
}

function renderBarGraph(svg, data) {
  const barWidth = 50;
  const maxHeight = Math.max(...data);
  data.forEach((value, index) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", index * (barWidth + 10));
    rect.setAttribute("y", 200 - (value / maxHeight) * 200);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", (value / maxHeight) * 200);
    rect.setAttribute("fill", "blue");
    svg.appendChild(rect);
  });
}

function renderPieChart(svg, data) {
  const total = data.reduce((a, b) => a + b, 0);
  let startAngle = 0;

  data.forEach((value, index) => {
    const endAngle = startAngle + (value / total) * 360;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const x1 = 150 + 100 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 100 - 100 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 150 + 100 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 100 - 100 * Math.sin((endAngle * Math.PI) / 180);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M150,100 L${x1},${y1} A100,100 0 ${largeArc} 1 ${x2},${y2} Z`);
    path.setAttribute("fill", index === 0 ? "green" : "red");
    svg.appendChild(path);

    startAngle = endAngle;
  });
}

document.getElementById("logout-button").addEventListener("click", () => {
  sessionStorage.removeItem("jwt");
  document.getElementById("login-page").style.display = "block";
  document.getElementById("profile-page").style.display = "none";
});
