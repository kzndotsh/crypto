// import React from 'react';
// import Chart from './Chart';

// const Charts = ({ coinData }) => {
//   console.log(coinData);

//   return (
//     <div className='charts flex flex-wrap'>
//       {coinData.map((coin) => (
//         <div
//           className='chart__container'
//           key={coin.name}>
//           <h2 className='coin__title'>{coin.name}</h2>
//           <h4 className='coin__symbol'>{coin.symbol}</h4>
//           <div className='coin__logo'>
//             <img
//               src={coin.image}
//               height='40'
//               alt={coin.name}
//             />
//           </div>
//           <Chart
//             sparklineData={coin.sparkline_in_7d.price}
//             className='border-2 border-yellow-500 rounded-md'
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Charts;
