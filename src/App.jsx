import { useState, useEffect, Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { user, navigation, userNavigation } from './config/config';

import moment from 'moment';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// import { useDarkMode } from './hooks/useDarkMode';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  params: {
    x_cg_demo_api_key: '',
  },
});

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Chart = ({ sparklineData }) => {
  const formattedData = sparklineData
    .map((price, idx) => {
      if (idx % 6 === 0) {
        const timeToSubtract = 168 - idx;
        const date = moment()
          .subtract(timeToSubtract, 'hours')
          .format('ddd h:mma');
        return { value: price, date };
      } else if (idx === sparklineData.length - 1) {
        const date = moment().format('ddd h:mma');
        return { value: price, date };
      }
      return null;
    })
    .filter((data) => data);

  return (
    <LineChart
      width={800}
      height={200}
      data={formattedData}>
      <Line
        type='monotone'
        dataKey='value'
        stroke='#8884d8'
      />
      <CartesianGrid
        stroke='#ccc'
        strokeDasharray='5 5'
      />
      <XAxis
        dataKey='date'
        interval={7}
      />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

const Charts = ({ coinData }) => {
  return (
    <div className='flex flex-row flex-wrap justify-normal'>
      {coinData.map((coin) => (
        <div
          className='flex-1 m-4 w-full border-2 border-yellow-500 rounded-lg bg-white px-5 py-6 '
          key={coin.name}>
          <div className=''>
            <h2 className='text-2xl'>{coin.name}</h2>
            <h3 className='inline-flex items-center rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-red-100'>
              {coin.symbol}
            </h3>
          </div>
          <div className='flex justify-start'>
            <img
              src={coin.image}
              alt={coin.name}
              className='h-32 p-6 rounded-full'
            />
          </div>
          <Chart sparklineData={coin.sparkline_in_7d.price} />
        </div>
      ))}
    </div>
  );
};

function getData() {
  try {
    const response = axiosInstance.get(
      '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true'
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default function App() {
  const [coinData, setCoinData] = useState([]);
  // const [darkMode, setDarkMode] = useDarkMode(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData();
      console.log;
      setCoinData(response.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className='min-h-full'>
        <div className='bg-gray-800 pb-32'>
          <Disclosure
            as='nav'
            className='bg-gray-800'>
            {({ open }) => (
              <>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                  <div className='border-b border-gray-700'>
                    <div className='flex h-16 items-center justify-between px-4 sm:px-0'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0'>
                          <img
                            className='h-8 w-8'
                            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500'
                            alt='Your Company'
                          />
                        </div>
                        <div className='hidden md:block'>
                          <div className='ml-10 flex items-baseline space-x-4'>
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                  'rounded-md px-3 py-2 text-sm font-medium'
                                )}
                                aria-current={
                                  item.current ? 'page' : undefined
                                }>
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className='hidden md:block'>
                        <div className='ml-4 flex items-center md:ml-6'>
                          <button
                            type='button'
                            className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                            <span className='absolute -inset-1.5' />
                            <span className='sr-only'>View notifications</span>
                            <BellIcon
                              className='h-6 w-6'
                              aria-hidden='true'
                            />
                          </button>

                          {/* Profile dropdown */}
                          <Menu
                            as='div'
                            className='relative ml-3'>
                            <div>
                              <Menu.Button className='relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                                <span className='absolute -inset-1.5' />
                                <span className='sr-only'>Open user menu</span>
                                <img
                                  className='h-8 w-8 rounded-full'
                                  src={user.imageUrl}
                                  alt=''
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter='transition ease-out duration-100'
                              enterFrom='transform opacity-0 scale-95'
                              enterTo='transform opacity-100 scale-100'
                              leave='transition ease-in duration-75'
                              leaveFrom='transform opacity-100 scale-100'
                              leaveTo='transform opacity-0 scale-95'>
                              <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                {userNavigation.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <a
                                        href={item.href}
                                        className={classNames(
                                          active ? 'bg-gray-100' : '',
                                          'block px-4 py-2 text-sm text-gray-700'
                                        )}>
                                        {item.name}
                                      </a>
                                    )}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className='-mr-2 flex md:hidden'>
                        {/* Mobile menu button */}
                        <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                          <span className='absolute -inset-0.5' />
                          <span className='sr-only'>Open main menu</span>
                          {open ? (
                            <XMarkIcon
                              className='block h-6 w-6'
                              aria-hidden='true'
                            />
                          ) : (
                            <Bars3Icon
                              className='block h-6 w-6'
                              aria-hidden='true'
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className='border-b border-gray-700 md:hidden'>
                  <div className='space-y-1 px-2 py-3 sm:px-3'>
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as='a'
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}>
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className='border-t border-gray-700 pb-3 pt-4'>
                    <div className='flex items-center px-5'>
                      <div className='flex-shrink-0'>
                        <img
                          className='h-10 w-10 rounded-full'
                          src={user.imageUrl}
                          alt=''
                        />
                      </div>
                      <div className='ml-3'>
                        <div className='text-base font-medium leading-none text-white'>
                          {user.name}
                        </div>
                        <div className='text-sm font-medium leading-none text-gray-400'>
                          {user.email}
                        </div>
                      </div>
                      <button
                        type='button'
                        className='relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                        <span className='absolute -inset-1.5' />
                        <span className='sr-only'>View notifications</span>
                        <BellIcon
                          className='h-6 w-6'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                    <div className='mt-3 space-y-1 px-2'>
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as='a'
                          href={item.href}
                          className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'>
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className='py-10'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <h1 className='text-3xl font-bold tracking-tight text-white'>
                Crypto Tracker
              </h1>
            </div>
          </header>
        </div>

        <main className='-mt-32'>
          <div className='mx-auto w-full px-1 pb-12 sm:px-6 lg:px-8'>
            <div className='rounded-lg bg-white px-4 py-5 shadow sm:px-5'>
              <Charts coinData={coinData} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
