// app.get('/', (_req: Request, res: Response) =>
//   res.send(
//     `check via https://localhost:${PORT}/status of er een ics file beschikbaar is of een request naar https://localhost:${PORT}/generate om een ics file te maken of een connect via https://localhost:${PORT}/callender`
//   )
// );

// app.get('/callender', function (_req, res) {
//   const file = `${__dirname}/public/feyenoord.ics`;
//   res.download(file); // Set disposition and send it.
// });

// app.get('/generate', function (_req, res) {
//   if (!isGenerating) {
//     isGenerating = true;
//     generateIcs().then(() => {
//       console.log('generated ics');
//       isGenerating = false;
//     });
//     res.send('file is generating wait a couple of minutes'); // Set disposition and send it.
//   } else {
//     res.send('file is already generating');
//   }
// });

// app.get('/startGenerateTask', (_req, res) => {
//   if (!isGenerating) {
//     isGenerating = true;
//     generateIcs().then(() => {
//       console.log('generated ics');
//       isGenerating = false;
//     });
//   }
//   cron.schedule('*/60 * * * *', () => {
//     if (!isGenerating) {
//       isGenerating = true;
//       generateIcs().then(() => {
//         console.log('generated ics');
//         isGenerating = false;
//       });
//     }
//     console.log('cron job finished');
//   });
//   res.send('cron job is ingesteld');
// });

// app.get('/status', (_req, res) => {
//   if (isGenerating) {
//     res.send('er wordt een ics gegenereerd');
//     return;
//   }
//   if (existsSync(`${__dirname}/public/feyenoord.ics`)) {
//     res.send('er is een ics file beschikbaar');
//     return;
//   }
//   res.send(
//     `er is geen ics file beschikbaar maak een request naar https://localhost:${PORT}/generate`
//   );
// });