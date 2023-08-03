$(document).ready(function() {
    document.getElementById("switch-search").addEventListener("click", changeButton)
})

function changeButton() {
    if (document.getElementById("switch-search-btn").textContent == "Advanced Search") {
        document.getElementById("query-form").innerHTML = "<input type=\"text\" class=\"search-bar\" name=\"userQuery\" id=\"userQuery\" placeholder=\"Search within Crossref\"/><button class=\"search\" type=\"submit\" id=\"query-button\">Submit query</button>";
        document.getElementById("switch-search-btn").innerHTML = "Simple Search"
        document.getElementById("advanced-search-note").innerHTML = "Advanced Search enabled. Construct your query in the form of \"query.title=...&query.bibliographic=...\""
    } else {
        document.getElementById("query-form").innerHTML =  "<input type=\"text\" class=\"search-bar\" name=\"userQuery=query.title\" id=\"userQuery\" placeholder=\"Search within Crossref\"/><button class=\"search\" type=\"submit\" id=\"query-button\">Submit query</button>";
        document.getElementById("switch-search-btn").innerHTML = "Advanced Search"
        document.getElementById("advanced-search-note").innerHTML = ""
    }
}

/* $("#query-form") = 
    <form id="query-form" action="dashboard-results.html" method="GET"> 
                    <input type="text" class="search-bar" name="userQuery" id="userQuery" placeholder="Search within Crossref"/>
                    <button type="submit" id="query-button">Submit query</button>
    </form>; */