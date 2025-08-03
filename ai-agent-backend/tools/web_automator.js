/**
 * Web Automation Tool using Puppeteer
 * Handles various web automation tasks like searching BookMyShow, booking tickets, etc.
 */

const puppeteer = require('puppeteer');

class WebAutomator {
  /**
   * Search for movie tickets on BookMyShow
   * @param {Object} params - Search parameters
   * @param {string} params.movie - Movie name
   * @param {string} params.city - City name
   * @param {string} params.date - Date for booking (optional)
   * @returns {Promise<Object>} - Search results
   */
  async searchBookMyShow({ movie, city, date }) {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
      const page = await browser.newPage();
      await page.goto('https://in.bookmyshow.com/', { waitUntil: 'networkidle2' });
      
      // Select city
      await page.waitForSelector('[placeholder="Search for your city"]');
      await page.type('[placeholder="Search for your city"]', city);
      await page.keyboard.press('Enter');
      
      // Search for movie
      await page.waitForSelector('.sc-jTzLTM.hQPNDY');
      await page.click('.sc-jTzLTM.hQPNDY');
      await page.type('.sc-jTzLTM.hQPNDY', movie);
      await page.keyboard.press('Enter');
      
      // Wait for search results
      await page.waitForSelector('.style__StyledText-sc-7o7nez-0', { timeout: 5000 }).catch(() => {});
      
      // Extract movie results
      const results = await page.evaluate(() => {
        const movies = document.querySelectorAll('.style__StyledText-sc-7o7nez-0');
        return Array.from(movies).map(movie => movie.textContent).slice(0, 5);
      });
      
      return {
        success: true,
        results: results.length > 0 ? results : ['No results found'],
        message: `Found ${results.length} results for ${movie} in ${city}`
      };
    } catch (error) {
      console.error('BookMyShow automation error:', error);
      return {
        success: false,
        message: 'Failed to search BookMyShow. ' + error.message
      };
    } finally {
      await browser.close();
    }
  }
  
  /**
   * Search for weather information
   * @param {Object} params - Search parameters
   * @param {string} params.location - Location name
   * @returns {Promise<Object>} - Weather results
   */
  async searchWeather({ location }) {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
      const page = await browser.newPage();
      await page.goto(`https://www.google.com/search?q=weather+in+${encodeURIComponent(location)}`, { waitUntil: 'networkidle2' });
      
      // Extract weather information
      const weatherInfo = await page.evaluate(() => {
        const temp = document.querySelector('#wob_tm')?.textContent;
        const condition = document.querySelector('#wob_dc')?.textContent;
        const location = document.querySelector('.BBwThe')?.textContent;
        
        return { temp, condition, location };
      });
      
      return {
        success: true,
        weather: weatherInfo,
        message: `Weather in ${location}: ${weatherInfo.temp}°C, ${weatherInfo.condition}`
      };
    } catch (error) {
      console.error('Weather search error:', error);
      return {
        success: false,
        message: 'Failed to get weather information. ' + error.message
      };
    } finally {
      await browser.close();
    }
  }
  
  /**
   * Open YouTube and play a video
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @returns {Promise<Object>} - Results
   */
  async playYouTubeVideo({ query }) {
    const browser = await puppeteer.launch({ headless: 'new' });
    try {
      const page = await browser.newPage();
      await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle2' });
      
      // Search for video
      await page.waitForSelector('input#search');
      await page.type('input#search', query);
      await page.keyboard.press('Enter');
      
      // Wait for search results and click first video
      await page.waitForSelector('#video-title');
      await page.click('#video-title');
      
      // Get video title
      await page.waitForSelector('.title.style-scope.ytd-video-primary-info-renderer');
      const videoTitle = await page.evaluate(() => {
        return document.querySelector('.title.style-scope.ytd-video-primary-info-renderer')?.textContent.trim();
      });
      
      return {
        success: true,
        videoTitle,
        message: `Playing "${videoTitle}" on YouTube`
      };
    } catch (error) {
      console.error('YouTube automation error:', error);
      return {
        success: false,
        message: 'Failed to play YouTube video. ' + error.message
      };
    } finally {
      await browser.close();
    }
  }
}

module.exports = new WebAutomator();