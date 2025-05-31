const express = require("express");
const googleTrends = require("google-trends-api");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// Function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to get interest over time with retry mechanism
async function getInterestOverTime(keywords, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await googleTrends.interestOverTime({
                keyword: keywords,
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                granularTimeResolution: true,
                hl: "en-US",
                timezone: 0,
                geo: "",
            });

            // Validate that we got JSON response
            const parsed = JSON.parse(result);
            if (!parsed.default?.timelineData) {
                throw new Error("Invalid response format");
            }

            return parsed;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) throw error;
            await delay(1000); // Wait 1 second before retrying
        }
    }
}

// Function to get interest by region with retry mechanism
async function getInterestByRegion(keywords, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await googleTrends.interestByRegion({
                keyword: keywords,
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                resolution: "COUNTRY",
                hl: "en-US",
                timezone: 0,
                geo: "",
            });

            // Validate that we got JSON response
            const parsed = JSON.parse(result);
            if (!parsed.default?.geoMapData) {
                throw new Error("Invalid response format");
            }

            return parsed;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) throw error;
            await delay(1000);
        }
    }
}

// Function to get related queries with retry mechanism
async function getRelatedQueries(keyword, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await googleTrends.relatedQueries({
                keyword: keyword,
                startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                hl: "en-US",
                timezone: 0,
                geo: "",
            });

            // Validate that we got JSON response
            const parsed = JSON.parse(result);
            if (!parsed.default?.rankedList) {
                throw new Error("Invalid response format");
            }

            return parsed;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) throw error;
            await delay(1000);
        }
    }
}

// Function to calculate trend stability
function calculateTrendStability(timelineData) {
    const values = timelineData.map((point) => point.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stability = 1 / (1 + Math.sqrt(variance));

    if (stability > 0.8) return "Long-term trend";
    if (stability > 0.5) return "Medium-term trend";
    return "Short-term trend";
}

app.post("/analyze", async (req, res) => {
    try {
        const { keywords } = req.body;
        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({ error: "Please provide an array of keywords" });
        }

        // Add delay between requests to avoid rate limiting
        await delay(500);

        const results = {
            interestOverTime: await getInterestOverTime(keywords),
            interestByRegion: await getInterestByRegion(keywords),
            relatedQueries: {},
            trendStability: {},
        };

        // Get related queries for each keyword
        for (const keyword of keywords) {
            await delay(500); // Add delay between requests
            results.relatedQueries[keyword] = await getRelatedQueries(keyword);
        }

        // Calculate trend stability
        const timelineData = results.interestOverTime.default.timelineData;
        for (const keyword of keywords) {
            const keywordData = timelineData.map((point) => ({
                time: point.time,
                value: point.value[0],
            }));
            results.trendStability[keyword] = calculateTrendStability(keywordData);
        }

        res.json(results);
    } catch (error) {
        console.error("Error in /analyze endpoint:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
