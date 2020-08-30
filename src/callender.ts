import puppeteer from 'puppeteer';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import * as ics from 'ics';

const parse = async (url: string): Promise<Match[]> => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
    ],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.goto(url);

  try {
    // @ts-ignore
    await page.$eval('.qc-cmp-button', (f) => f.click());
    // @ts-ignore
    await page.$eval('.qc-cmp-save-and-exit', (f) => f.click());
  } catch (error) {
    console.log('geen cookies');
  }

  const matches = await page.$$('.match');
  const rtrMatch: Match[] = [];
  for (const match of matches) {
    // const idProp = await match.getProperty('id');
    // const id = await idProp.jsonValue()
    const date = await match.$('td.full-date');
    const teamaS = await match.$('td.team.team-a > a');
    const teambS = await match.$('td.team.team-b > a');
    // const statusS = await match.$('td.score-time > a');
    const compS = await match.$('td.competition > a');
    const dateText = await date?.getProperty('textContent');
    const teama = await teamaS?.getProperty('textContent');
    const teamb = await teambS?.getProperty('textContent');
    // const status = await statusS?.getProperty('textContent');
    const compFullname = await compS?.getProperty('title');
    const compShortname = await compS?.getProperty('textContent');

    const link = await match.$('td.score-time > a');
    const href = await link?.getProperty('href');

    const page2 = await browser.newPage();
    await page2.goto(`${await href!.jsonValue()}`);
    const infos = await page2.$(
      '#page_match_1_block_match_info_5 > div > div > div.details'
    );
    const details = await page2.$(
      '#page_match_1_block_match_info_5 > div > div > div.container.middle > h3'
    );
    const detailProp = await details?.getProperty('textContent');
    const detailPropSting = (await detailProp?.jsonValue()) as string;
    let time: string = '';
    let score: string = '';
    const textS = await infos?.getProperty('textContent');
    const text: string = (await textS?.jsonValue()) as string;

    for (const info of text.split('\n')) {
      // console.log(info);
      if (info.includes(':')) {
        time = info.trim();
      }
    }
    if (detailPropSting) {
      for (const detail of detailPropSting.split('\n')) {
        if (
          detail.includes('-') &&
          !detail.includes('HT') &&
          !detail.includes('FT')
        ) {
          score = detail.trim();
        }
      }
    }
    page2.close();
    if (time !== '') {
      const timeSplit = time.trim().split(':');
      let d = null;
      try {
        d = `${await dateText?.jsonValue()}`.split('/');
      } catch (error) {
        d = [9, 12, 1997];
      }

      const matchData = text.split('\n');
      const filtertMatchdata = matchData.filter((x) => x.trim() !== '');

      const matchObj: Match = {
        date: new Date(
          +`20${+d[2]}`,
          +d[1] - 1,
          +d[0],
          +timeSplit[0] + 2,
          +timeSplit[1]
        ),
        home: `${await teama?.jsonValue()}`.trim(),
        away: `${await teamb?.jsonValue()}`.trim(),
        status: score,
        compFullname: `${await compFullname?.jsonValue()}`,
        compShortname: `${await compShortname?.jsonValue()}`,
        startTime: `${timeSplit[0]}:${timeSplit[1]}`,
        stadium: filtertMatchdata[filtertMatchdata.length - 1].trim(),
      };

      rtrMatch.push(matchObj);
      console.log(`parsed match ${matchObj.home} - ${matchObj.away}`);
    } else {
      console.log(
        `${await teama?.jsonValue()}`.trim() +
          ' - ' +
          `${await teamb?.jsonValue()}`.trim() +
          ' heeft geen tijd'
      );
    }
  }
  await page.close();
  await browser.close();
  return rtrMatch;
};

export const generateIcs = async () => {
  const matches: Match[] = await parse(
    'https://nl.soccerway.com/teams/netherlands/feyenoord-rotterdam-nv/1518/matches/'
  );

  // @ts-ignore
  const activitys: ics.EventAttributes[] = [];

  matches.forEach((match) => {
    const dateArray: ics.DateArray = [
      match.date.getFullYear(),
      match.date.getMonth() + 1,
      match.date.getDate(),
      match.date.getHours() + match.date.getTimezoneOffset() / 60,
      match.date.getMinutes(),
    ];

    const alarms: ics.Alarm[] = [];

    alarms.push({
      action: 'audio',
      trigger: { minutes: 30, before: true },
    });

    activitys.push({
      title: createTitle(match),
      start: dateArray,
      duration: { hours: 1, minutes: 45 },
      location: match.stadium,
      description: `Dit is een ${match.compFullname} wedstrijd`,
      alarms: alarms,
    });
  });

  // @ts-ignore
  createIcs(activitys);
};

function createTitle(match: Match) {
  if (match.status !== '') {
    return `${match.home} -  ${match.away}(${match.status})`;
  } else {
    return `${match.home} -  ${match.away}`;
  }
}

function createIcs(activitys: ics.EventAttributes[]) {
  ics.createEvents(activitys, (error, value) => {
    if (error) {
      console.log(error);
    }
    if (existsSync(`${__dirname}/public/feyenoord.ics`)) {
      unlinkSync(`${__dirname}/public/feyenoord.ics`);
    }
    if (!existsSync(`${__dirname}/public`)) {
      mkdirSync(`${__dirname}/public`);
    }

    writeFileSync(`${__dirname}/public/feyenoord.ics`, value);
    console.log('done');
  });
}

interface Match {
  date: Date;
  home: string;
  away: string;
  status: string;
  compFullname: string;
  compShortname: string;
  startTime: string;
  stadium: string;
}
