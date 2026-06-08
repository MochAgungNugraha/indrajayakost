import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Initial mock state inside server memory to ensure multi-device sync
let dbRooms: any[] = [
  // Jimbaran: 12 rooms (J-01 to J-12)
  { id: 'j1', roomNumber: 'J-01', type: 'Standard', price: 1500000, size: '3x4m²', bedType: 'Single', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' },
  { id: 'j2', roomNumber: 'J-02', type: 'Standard', price: 1500000, size: '3x4m²', bedType: 'Single', isAvailable: false, tenantId: 'tenant1', location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' },
  { id: 'j3', roomNumber: 'J-03', type: 'Deluxe', price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o' },
  { id: 'j4', roomNumber: 'J-04', type: 'Deluxe', price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant3', location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o' },
  { id: 'j5', roomNumber: 'J-05', type: 'Executive', price: 3500000, size: '5x6m²', bedType: 'King', isAvailable: false, tenantId: 'tenant2', location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY' },
  { id: 'j6', roomNumber: 'J-06', type: 'Executive', price: 3500000, size: '5x6m²', bedType: 'King', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY' },
  { id: 'j7', roomNumber: 'J-07', type: 'Suite', price: 4800000, size: '6x8m²', bedType: 'Super King', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U' },
  { id: 'j8', roomNumber: 'J-08', type: 'Standard', price: 1500000, size: '3x4m²', bedType: 'Single', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' },
  { id: 'j9', roomNumber: 'J-09', type: 'Deluxe', price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o' },
  { id: 'j10', roomNumber: 'J-10', type: 'Executive', price: 3500000, size: '5x6m²', bedType: 'King', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY' },
  { id: 'j11', roomNumber: 'J-11', type: 'Suite', price: 4800000, size: '6x8m²', bedType: 'Super King', isAvailable: true, location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U' },
  { id: 'j12', roomNumber: 'J-12', type: 'Deluxe', price: 2200000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant4', location: 'Jimbaran', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o' },

  // Pagerwojo: 4 rooms (P-01 to P-04)
  { id: 'p1', roomNumber: 'P-01', type: 'Standard', price: 1600000, size: '3x4m²', bedType: 'Single', isAvailable: true, location: 'Pagerwojo Ngemplak', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' },
  { id: 'p2', roomNumber: 'P-02', type: 'Deluxe', price: 2300000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant5', location: 'Pagerwojo Ngemplak', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o' },
  { id: 'p3', roomNumber: 'P-03', type: 'Executive', price: 3600000, size: '5x6m²', bedType: 'King', isAvailable: true, location: 'Pagerwojo Ngemplak', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY' },
  { id: 'p4', roomNumber: 'P-04', type: 'Suite', price: 4900000, size: '6x8m²', bedType: 'Super King', isAvailable: true, location: 'Pagerwojo Ngemplak', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U' },

  // Magersari: 5 rooms (M-01 to M-05)
  { id: 'm1', roomNumber: 'M-01', type: 'Standard', price: 1400000, size: '3x4m²', bedType: 'Single', isAvailable: true, location: 'Perumahan Magersari', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' },
  { id: 'm2', roomNumber: 'M-02', type: 'Deluxe', price: 2100000, size: '4x5m²', bedType: 'Queen', isAvailable: false, tenantId: 'tenant6', location: 'Perumahan Magersari', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoBhIrnJ7zaLAkOgIyPb7UX6AQJKWe05NElS6J28LE6bfxg87p8Yrp7loEMMdDcS5xSIX0736i1xEEk_kn_T2r_a__s4HfqMF2OCf1NY-Xybcrfzr9dSrL5VJ6sV6sQPPu3jSt4j_2AqdDGOx-9bxrcBQYK5K5RQ6kLM7g2B7zG7anY_afq18mT1NGrOsMssi1IYD33syNO67fSqi9X0dOgR99W84Z_AnhE3tLnRmcpZN9eBRZAmbQKwuiKuJ8B8sJzESrxnttD7o' },
  { id: 'm3', roomNumber: 'M-03', type: 'Executive', price: 3400000, size: '5x6m²', bedType: 'King', isAvailable: true, location: 'Perumahan Magersari', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1UM6uYhwMt0t7efCQSmQskWdAZG3tUyQJuJnR2PLnJCQYFmsI3vn7e8LmFeNu43uVkq0fF0Mf8yQaQSolCG_x_04fpB2KgxuZqQhvPpuB6TKWiKlgMJyrX8OJjgrcworTY7QGrmUXACpBYSwpyEkWGPGgOFEpDIGEFi3OAGGG2DI9vdQWtoZu0W1JbxLeCM0Cf-C0O1Lvp4kWz9HNi6JOQQ5Pu6Oxq_wNDJqKzDkna2Z_fdGBIZBaToInFAYeW-VviGgzd3B5XnY' },
  { id: 'm4', roomNumber: 'M-04', type: 'Suite', price: 4700000, size: '6x8m²', bedType: 'Super King', isAvailable: true, location: 'Perumahan Magersari', facilities: ['AC', 'Wifi', 'Water Heater', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9xNVrx29BzFQoK4C_8RoH7xlzl14EMYy_KQ8D0S5D4f0HoYehFDfCTpT8F4tC5ZOQn_Ivt7FDorsdcE0JIWyeCg4owgdrItudp4l2a-qj6U3-c0wDweYzIOgo2xnDv1VXIQU7f3XkNrovE48V7xAUe50j4Ele60ofX74u-PAifvy9jUHDrrJLTtSm1j1CKEXUivzc9SsP5F-IxUpHnwK_p-GHsvquWzWpfrLYXMXoTo7HS9u1UNRZfPHIglNfsDqiNJhSIyfDs5U' },
  { id: 'm5', roomNumber: 'M-05', type: 'Standard', price: 1400000, size: '3x4m²', bedType: 'Single', isAvailable: true, location: 'Perumahan Magersari', facilities: ['AC', 'Wifi', 'Laundry'], image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg' },
];

let dbUsers: any[] = [
  { id: 'admin1', email: 'agungnugraha5077@gmail.com', name: 'Agung Nugraha', role: 'admin', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Agung' },
  { id: 'admin2', email: 'mochagungnugraha5077@gmail.com', name: 'Moch Agung Nugraha', role: 'admin', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Moch' },
  { id: 'tenant1', email: 'budi@gmail.com', name: 'Budi Santoso', role: 'tenant', roomNumber: 'J-02', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHU1x3Medmc3q_d01lLtVI6-mMUXYTk9P05NbIlsQnmsSepKVYyFI9Z1jLK98eHC1aw46J7AXiPzxelOoIq_bsLPbMOp6Q7GqAegmPDstOGGL9VQkyaNK8tx_knvkDht7RnyxeBJG3Afr9I78D2431z9Fy4R-89LzjDjEmCwu4W2FFgjZ-jcNa8nDqNZ5ve3KTrUnb3soMqep7f0uStiCxBrUyiyDYdj7NmubszL9gGL7pECH9H2ZObv_q1BYqS7I7KvhRRLIAmRs', entryDate: '12 Jan 2024' },
  { id: 'tenant2', email: 'siti@gmail.com', name: 'Siti Aminah', role: 'tenant', roomNumber: 'J-05', entryDate: '05 Mar 2024' },
  { id: 'tenant3', email: 'joko@gmail.com', name: 'Joko Widada', role: 'tenant', roomNumber: 'J-04', entryDate: '20 Feb 2024' },
  { id: 'tenant4', email: 'eka@gmail.com', name: 'Eka Putri', role: 'tenant', roomNumber: 'J-12', entryDate: '15 Mei 2024' },
  { id: 'tenant5', email: 'ahmad@gmail.com', name: 'Ahmad Fauzi', role: 'tenant', roomNumber: 'P-02', entryDate: '01 Apr 2024' },
  { id: 'tenant6', email: 'dewi@gmail.com', name: 'Dewi Lestari', role: 'tenant', roomNumber: 'M-02', entryDate: '10 Feb 2024' }
];

let dbBookings: any[] = [
  { id: 'book1', roomId: 'j2', tenantId: 'tenant1', tenantName: 'Budi Santoso', roomNumber: 'J-02', location: 'Jimbaran', price: 1500000, status: 'active', entryDate: '12 Jan 2024', paymentStatus: 'Belum Lunas' },
  { id: 'book2', roomId: 'j5', tenantId: 'tenant2', tenantName: 'Siti Aminah', roomNumber: 'J-05', location: 'Jimbaran', price: 3500000, status: 'active', entryDate: '05 Mar 2024', paymentStatus: 'Lunas' },
  { id: 'book3', roomId: 'j4', tenantId: 'tenant3', tenantName: 'Joko Widada', roomNumber: 'J-04', location: 'Jimbaran', price: 2200000, status: 'active', entryDate: '20 Feb 2024', paymentStatus: 'Belum Lunas' },
  { id: 'book4', roomId: 'j12', tenantId: 'tenant4', tenantName: 'Eka Putri', roomNumber: 'J-12', location: 'Jimbaran', price: 2200000, status: 'active', entryDate: '15 Mei 2024', paymentStatus: 'Lunas' },
  { id: 'book5', roomId: 'p2', tenantId: 'tenant5', tenantName: 'Ahmad Fauzi', roomNumber: 'P-02', location: 'Pagerwojo Ngemplak', price: 2300000, status: 'active', entryDate: '01 Apr 2024', paymentStatus: 'Lunas' },
  { id: 'book6', roomId: 'm2', tenantId: 'tenant6', tenantName: 'Dewi Lestari', roomNumber: 'M-02', location: 'Perumahan Magersari', price: 2100000, status: 'active', entryDate: '10 Feb 2024', paymentStatus: 'Lunas' }
];

let dbReports = [
  { id: 'rep1', tenantId: 'tenant1', tenantName: 'Budi Santoso', roomNumber: 'J-02', title: 'AC Kurang Dingin', description: 'AC menyala tetapi udara di kamar tetap hangat.', status: 'Diproses', createdAt: '2026-06-05T10:00:00Z' },
  { id: 'rep2', tenantId: 'tenant2', tenantName: 'Siti Aminah', roomNumber: 'J-05', title: 'Fitting Lampu Kamar Mandi', description: 'Lampu berkedip terus menerus.', status: 'Selesai', createdAt: '2026-06-04T08:30:00Z' }
];

let dbTransactions = [
  { id: 't1', date: '2026-06-01', category: 'PEMASUKAN', title: 'Sewa J-05 - Siti Aminah', description: 'Pembayaran Bulanan Kamar J-05', status: 'Berhasil', amount: 3500000, paymentMethod: 'Transfer BCA' },
  { id: 't2', date: '2026-06-02', category: 'PENGELUARAN', title: 'Pembelian Token Listrik', description: 'Token Listrik Gedung Utama & Koridor', status: 'Berhasil', amount: 850000 },
  { id: 't3', date: '2026-06-03', category: 'PEMASUKAN', title: 'Sewa J-12 - Eka Putri', description: 'Sewa Kamar J-12', status: 'Berhasil', amount: 2200000, paymentMethod: 'Transfer Mandiri' },
  { id: 't4', date: '2026-06-04', category: 'PENGELUARAN', title: 'Gaji Penjaga Kost', description: 'Pembayaran Gaji Bulanan Penjaga', status: 'Berhasil', amount: 2500000 },
  { id: 't5', date: '2026-06-05', category: 'PEMASUKAN', title: 'Sewa M-02 - Dewi Lestari', description: 'Pembayaran Bulanan M-02', status: 'Berhasil', amount: 2100000, paymentMethod: 'QRIS' },
  { id: 't6', date: '2026-06-06', category: 'PENGELUARAN', title: 'Perbaikan Pipa Air', description: 'Mengganti pipa yang bocor di Jimbaran', status: 'Berhasil', amount: 450000 }
];

let dbNotifications = [
  { id: 'n1', title: 'Pemeliharaan AC Kost', message: 'Pembersihan AC rutin untuk wilayah Jimbaran dijadwalkan tanggal 10 Juni 2026.', type: 'maintenance', createdAt: '2026-06-06T12:00:00Z', isRead: false },
  { id: 'n2', title: 'Tagihan Pembayaran', message: 'Tagihan sewa untuk Kamar J-02 jatuh tempo pada tanggal 15 Juni 2026.', type: 'payment', createdAt: '2026-06-05T09:00:00Z', isRead: false }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Global Sycn
  app.get("/api/sync", (req, res) => {
    res.json({
      rooms: dbRooms,
      users: dbUsers,
      bookings: dbBookings,
      reports: dbReports,
      transactions: dbTransactions,
      notifications: dbNotifications
    });
  });

  // Auth - Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email wajib diisi" });
    }
    const lowerEmail = email.toLowerCase();
    const isAdminEmail = lowerEmail === 'agungnugraha5077@gmail.com' || lowerEmail === 'mochagungnugraha5077@gmail.com';

    if (isAdminEmail) {
      return res.status(401).json({ 
        success: false, 
        message: "Akun administrator hanya diperbolehkan masuk melalui Google Sign-In demi alasan keamanan tinggi." 
      });
    }

    // Simple mock auth matching based on email
    const user = dbUsers.find(u => u.email.toLowerCase() === lowerEmail);
    if (user) {
      // Security measure: prevent administrative hijacking via email/password form
      if (user.role === 'admin') {
        user.role = 'guest';
      }
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Email tidak terdaftar atau password salah" });
    }
  });

  // Auth - Register
  app.post("/api/auth/register", (req, res) => {
    const { name, email, role, roomNumber } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email wajib diisi" });
    }
    const lowerEmail = email.toLowerCase();
    const isAdminEmail = lowerEmail === 'agungnugraha5077@gmail.com' || lowerEmail === 'mochagungnugraha5077@gmail.com';

    if (isAdminEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "Akun administrator hanya diperbolehkan mendaftar/masuk melalui Google Sign-In." 
      });
    }
    
    if (dbUsers.some(u => u.email.toLowerCase() === lowerEmail)) {
      return res.status(400).json({ success: false, message: "Email sudah digunakan" });
    }

    // Role safety restrictions: standard form cannot grant admin role
    const assignedRole = (role === 'admin') ? 'guest' : (role || 'guest');

    const newUser = {
      id: "u_" + Math.random().toString(36).substring(2, 9),
      name,
      email: lowerEmail,
      role: assignedRole,
      roomNumber,
      entryDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    dbUsers.push(newUser);
    res.json({ success: true, user: newUser });
  });

  // Auth - Google Registration & Log-In
  app.post("/api/auth/google", (req, res) => {
    const { name, email, avatar } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email Google wajib dilampirkan" });
    }

    const lowerEmail = email.toLowerCase();
    const isAdminEmail = lowerEmail === 'agungnugraha5077@gmail.com' || lowerEmail === 'mochagungnugraha5077@gmail.com';

    // Check if the user already exists
    let user = dbUsers.find(u => u.email.toLowerCase() === lowerEmail);
    
    if (!user) {
      // Create new user with Google details as guest/tenant/admin
      user = {
        id: "u_g_" + Math.random().toString(36).substring(2, 9),
        name: name || email.split('@')[0],
        email: lowerEmail,
        role: isAdminEmail ? "admin" : "guest",
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        entryDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      dbUsers.push(user);
    } else {
      // Ensure role is kept sync. Only authorized admin emails can be admin
      if (isAdminEmail) {
        user.role = "admin";
      } else if (user.role === "admin") {
        user.role = "guest"; // Revoke admin status for anyone else
      }
      // Update avatar if not present
      if (!user.avatar && avatar) {
        user.avatar = avatar;
      }
    }

    res.json({ success: true, user });
  });

  // Google OIDC OAuth 2.0 URL Construct
  app.get("/api/auth/google/url", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const redirectUri = `${protocol}://${host}/auth/callback`;

    if (clientId) {
      // Real OIDC Google login URL
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email",
        access_type: "online",
        prompt: "select_account"
      });
      res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, isReal: true });
    } else {
      // Simulation beautiful login URL
      res.json({ url: "/auth/google-simulate", isReal: false });
    }
  });

  // Real OAuth Callback route handler
  app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) {
      return res.send("<h3>Peringatan: Code otentikasi tidak disediakan.</h3>");
    }

    try {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.get("host");
      const redirectUri = `${protocol}://${host}/auth/callback`;

      // Exchange code for Google ID token
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || "Authentication token exchange failed");
      }

      // Fetch official User Profile from Google API
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profile = await profileRes.json();

      res.send(
        '<!DOCTYPE html>' +
        '<html>' +
        '  <head>' +
        '    <title>Google Single Sign-On</title>' +
        '    <style>' +
        '      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #121212; color: #fff; }' +
        '      .card { text-align: center; padding: 2rem; background: #1e1e1e; border-radius: 12px; border: 1px solid #2e2e2e; }' +
        '      .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #8ab4f8; border-radius: 50%; width: 24px; height: 24px; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }' +
        '      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' +
        '    </style>' +
        '  </head>' +
        '  <body>' +
        '    <div class="card">' +
        '      <div class="spinner"></div>' +
        '      <p>Mengotentikasi dan mentransfer login ke jendela utama...</p>' +
        '    </div>' +
        '    <script>' +
        '      var payload = {' +
        '        type: "OAUTH_AUTH_SUCCESS",' +
        '        user: {' +
        '          name: ' + JSON.stringify(profile.name || profile.given_name || "Google User") + ',' +
        '          email: ' + JSON.stringify(profile.email) + ',' +
        '          avatar: ' + JSON.stringify(profile.picture || ('https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(profile.email))) +
        '        }' +
        '      };' +
        '      if (window.opener) {' +
        '        window.opener.postMessage(payload, "*");' +
        '        setTimeout(function() { window.close(); }, 500);' +
        '      } else {' +
        '        window.location.href = "/";' +
        '      }' +
        '    </script>' +
        '  </body>' +
        '</html>'
      );
    } catch (err: any) {
      console.error(err);
      res.status(500).send('<h3>Gagal mengotentikasi OAuth 2.0 Google</h3><p>' + err.message + '</p>');
    }
  });

  // Serve a high-fidelity dynamic Google Single Sign-On (SSO) Client view
  app.get("/auth/google-simulate", (req, res) => {
    res.send(
      '<!DOCTYPE html>' +
      '<html lang="id">' +
      '<head>' +
      '  <meta charset="UTF-8">' +
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '  <title>Masuk - Akun Google</title>' +
      '  <style>' +
      '    * { box-sizing: border-box; font-family: Roboto, Arial, sans-serif; }' +
      '    body { background-color: #f0f4f9; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 16px; }' +
      '    .container { background-color: #ffffff; border-radius: 28px; width: 100%; max-width: 440px; padding: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); position: relative; border: 1px solid #e0e4ec; }' +
      '    .g-logo { display: flex; align-items: center; margin-bottom: 24px; }' +
      '    .g-logo svg { height: 24px; margin-right: 8px; }' +
      '    .title { font-size: 24px; font-weight: 400; color: #1f1f1f; margin: 0 0 8px 0; }' +
      '    .subtitle { font-size: 15px; color: #444746; margin: 0 0 28px 0; font-weight: 300; }' +
      '    .form-group { position: relative; margin-bottom: 24px; }' +
      '    .text-input { width: 100%; padding: 16px 14px; border: 1px solid #747775; border-radius: 4px; font-size: 16px; outline: none; transition: border-color 0.2s; background: transparent; }' +
      '    .text-input:focus { border: 2px solid #0b57d0; padding: 15px 13px; }' +
      '    .text-input:focus ~ label, .text-input:not(:placeholder-shown) ~ label { top: -8px; left: 10px; font-size: 12px; color: #0b57d0; background: #ffffff; padding: 0 4px; }' +
      '    label { position: absolute; pointer-events: none; left: 14px; top: 16px; font-size: 16px; color: #444746; transition: 0.2s ease all; }' +
      '    .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; }' +
      '    .btn-link { color: #0b57d0; font-weight: 500; font-size: 14px; background: none; border: none; cursor: pointer; padding: 8px 0; text-decoration: none; }' +
      '    .btn-link:hover { text-decoration: underline; }' +
      '    .btn-next { background-color: #0b57d0; color: #ffffff; border: none; border-radius: 100px; padding: 10px 24px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }' +
      '    .btn-next:hover { background-color: #0842a0; }' +
      '    .footer-nav { position: absolute; bottom: -30px; left: 0; right: 0; display: flex; justify-content: space-between; font-size: 12px; color: #5e5e5e; }' +
      '    .footer-links { display: flex; gap: 16px; }' +
      '    .footer-links a { text-decoration: none; color: inherit; }' +
      '    .footer-links a:hover { text-decoration: underline; }' +
      '    .active-sessions { border-top: 1px solid #e0e4ec; margin-top: 16px; padding-top: 16px; }' +
      '    .session-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #fdfdfd; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; cursor: pointer; text-align: left; }' +
      '    .session-item:hover { background: #f8fafc; }' +
      '    .avatar { width: 34px; height: 34px; border-radius: 50%; background: #007b83; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }' +
      '    .session-details { flex: 1; }' +
      '    .session-name { font-size: 13px; font-weight: 500; color: #1e293b; }' +
      '    .session-email { font-size: 11px; color: #64748b; }' +
      '    .badge-admin { background: #fef3c7; color: #b45309; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: auto; }' +
      '  </style>' +
      '</head>' +
      '<body>' +
      '  <div class="container">' +
      '    <div class="g-logo">' +
      '      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>' +
      '        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>' +
      '        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>' +
      '        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>' +
      '      </svg>' +
      '      <span style="font-size: 14px; font-weight: 500; color: #5f6368;">Sign in with Google</span>' +
      '    </div>' +
      '    <div id="step-email">' +
      '      <h2 class="title">Masuk</h2>' +
      '      <p class="subtitle">ke akun Google Anda</p>' +
      '      <div class="form-group">' +
      '        <input type="email" id="email-field" class="text-input" placeholder=" " required />' +
      '        <label for="email-field">Email atau ponsel</label>' +
      '      </div>' +
      '      <div id="active-sessions-panel" class="active-sessions" style="display: none;">' +
      '        <p style="font-size: 12px; font-weight: 500; color: #444746; margin: 0 0 10px 0;">Atau pilih akun tersimpan di browser ini:</p>' +
      '        <div id="sessions-list"></div>' +
      '      </div>' +
      '      <div class="actions">' +
      '        <button class="btn-link" onclick="window.close()">Batal</button>' +
      '        <button class="btn-next" onclick="goToName()">Berikutnya</button>' +
      '      </div>' +
      '    </div>' +
      '    <div id="step-name" style="display: none;">' +
      '      <h2 class="title">Satu langkah lagi</h2>' +
      '      <p class="subtitle" id="selected-email-sub"></p>' +
      '      <div class="form-group">' +
      '        <input type="text" id="name-field" class="text-input" placeholder=" " required />' +
      '        <label for="name-field">Nama Lengkap</label>' +
      '      </div>' +
      '      <div class="actions">' +
      '        <button class="btn-link" onclick="goBackToEmail()">Kembali</button>' +
      '        <button class="btn-next" onclick="submitAuth()">Masuk &rarr;</button>' +
      '      </div>' +
      '    </div>' +
      '    <div class="footer-nav">' +
      '      <div>Bahasa Indonesia</div>' +
      '      <div class="footer-links">' +
      '        <a href="#">Bantuan</a>' +
      '        <a href="#">Privasi</a>' +
      '        <a href="#">Persyaratan</a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <script>' +
      '    var savedSessions = [];' +
      '    try {' +
      '      savedSessions = JSON.parse(localStorage.getItem("google_simulated_sessions") || "[]");' +
      '    } catch(e) {}' +
      '    var activeSessionsPanel = document.getElementById("active-sessions-panel");' +
      '    var sessionsList = document.getElementById("sessions-list");' +
      '    if (savedSessions.length > 0) {' +
      '      activeSessionsPanel.style.display = "block";' +
      '      sessionsList.innerHTML = "";' +
      '      savedSessions.forEach(function(session) {' +
      '        var isAdmin = session.email === "agungnugraha5077@gmail.com" || session.email === "mochagungnugraha5077@gmail.com";' +
      '        var div = document.createElement("div");' +
      '        div.className = "session-item";' +
      '        div.onclick = function() { autoLogin(session.name, session.email); };' +
      '        div.innerHTML = ' +
      '          \'<div class="avatar" style="background: \' + stringToColor(session.name) + \'">\' + session.name.charAt(0).toUpperCase() + \'</div>\' +' +
      '          \'<div class="session-details font-sans">\' +' +
      '          \'  <div class="session-name">\' + session.name + \'</div>\' +' +
      '          \'  <div class="session-email">\' + session.email + \'</div>\' +' +
      '          \'</div>\' +' +
      '          (isAdmin ? \'<span class="badge-admin">Admin</span>\' : "");' +
      '        sessionsList.appendChild(div);' +
      '      });' +
      '    }' +
      '    function stringToColor(str) {' +
      '      var hash = 0;' +
      '      for (var i = 0; i < str.length; i++) {' +
      '        hash = str.charCodeAt(i) + ((hash << 5) - hash);' +
      '      }' +
      '      var colors = ["#1a73e8", "#137333", "#b06000", "#c5221f", "#007b83", "#7b1fa2"];' +
      '      return colors[Math.abs(hash) % colors.length];' +
      '    }' +
      '    var emailInput = "";' +
      '    function goToName() {' +
      '      emailInput = document.getElementById("email-field").value.trim();' +
      '      if (!emailInput || !emailInput.includes("@")) {' +
      '        alert("Masukkan alamat email valid!");' +
      '        return;' +
      '      }' +
      '      var matchedSession = savedSessions.find(function(s) { return s.email.toLowerCase() === emailInput.toLowerCase(); });' +
      '      if (matchedSession) {' +
      '        autoLogin(matchedSession.name, matchedSession.email);' +
      '        return;' +
      '      }' +
      '      document.getElementById("step-email").style.display = "none";' +
      '      document.getElementById("step-name").style.display = "block";' +
      '      document.getElementById("selected-email-sub").innerText = emailInput;' +
      '      var nameGuess = emailInput.split("@")[0].replace(/[._-]/g, " ").replace(/\\b\\w/g, function(c) { return c.toUpperCase(); });' +
      '      document.getElementById("name-field").value = nameGuess;' +
      '    }' +
      '    function goBackToEmail() {' +
      '      document.getElementById("step-name").style.display = "none";' +
      '      document.getElementById("step-email").style.display = "block";' +
      '    }' +
      '    function submitAuth() {' +
      '      var fullName = document.getElementById("name-field").value.trim();' +
      '      if (!fullName) {' +
      '        alert("Silakan masukkan Nama Lengkap Anda!");' +
      '        return;' +
      '      }' +
      '      var sessions = savedSessions.filter(function(s) { return s.email.toLowerCase() !== emailInput.toLowerCase(); });' +
      '      sessions.unshift({ name: fullName, email: emailInput });' +
      '      if (sessions.length > 5) sessions.pop();' +
      '      try {' +
      '        localStorage.setItem("google_simulated_sessions", JSON.stringify(sessions));' +
      '      } catch(e) {}' +
      '      autoLogin(fullName, emailInput);' +
      '    }' +
      '    function autoLogin(name, email) {' +
      '      var payload = {' +
      '        type: "OAUTH_AUTH_SUCCESS",' +
      '        user: {' +
      '          name: name,' +
      '          email: email,' +
      '          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=" + encodeURIComponent(name)' +
      '        }' +
      '      };' +
      '      if (window.opener) {' +
      '        window.opener.postMessage(payload, "*");' +
      '        window.close();' +
      '      } else {' +
      '        alert("Penjelajah utama tidak terdeteksi. Berhasil login sebagai: " + name);' +
      '      }' +
      '    }' +
      '  </script>' +
      '</body>' +
      '</html>'
    );
  });

  // Rooms - Manage
  app.post("/api/rooms/add", (req, res) => {
    const { roomNumber, type, price, size, bedType, location, facilities, image, description } = req.body;
    const newRoom = {
      id: "rm_" + Math.random().toString(36).substring(2, 9),
      roomNumber,
      type: type || "Standard",
      price: Number(price) || 1500000,
      size: size || "3x4m²",
      bedType: bedType || "Single",
      location: location || "Jimbaran",
      facilities: facilities || ["AC", "Wifi", "Laundry"],
      isAvailable: true,
      image: image || "https://lh3.googleusercontent.com/aida-public/AB6AXuAh9N3-596klyO7g-ayWyqOtHnMN1rHY0pQtBv7jSfLktClWWBGPUSxBw_S0Jg9sEEGxcd21bUxQkgH11MnUefUtSKIvf9Seyl4kLYMnzCYLECHpcBQHY5vtp_HkSgxJyEar0hfsSrVMqQXFvt_stbFvyBFO-hDW5wDUyUy3NG-huJwopTWYD7AVHBbcmZgzJiHwdfATuUOyuPo3WrYysE7u7aY3ETrqof18deJPaDhccM1rAaF-Vm502atr3rxcvTzFr4l9ZrTDpg",
      description: description || ""
    };

    dbRooms.push(newRoom);
    res.json({ success: true, room: newRoom });
  });

  // Rooms - Update price & image & description (Admin feature)
  app.post("/api/rooms/:id/update", (req, res) => {
    const { id } = req.params;
    const { price, image, description } = req.body;
    
    const room = dbRooms.find(r => r.id === id);
    if (!room) {
      return res.status(404).json({ success: false, message: "Kamar tidak ditemukan" });
    }

    if (price !== undefined) {
      room.price = Number(price);
    }
    if (image !== undefined) {
      room.image = image;
    }
    if (description !== undefined) {
      room.description = description;
    }

    res.json({ success: true, room });
  });

  // Bookings - New Booking Request
  app.post("/api/bookings", (req, res) => {
    const { roomId, tenantId, tenantName, email } = req.body;
    const room = dbRooms.find(r => r.id === roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Kamar tidak ditemukan" });
    }
    if (!room.isAvailable) {
      return res.status(400).json({ success: false, message: "Kamar sudah terisi" });
    }

    const bookingId = "book_" + Math.random().toString(36).substring(2, 9);
    const newBooking = {
      id: bookingId,
      roomId,
      tenantId: tenantId || "guest_" + Math.random().toString(36).substring(2, 9),
      tenantName: tenantName || "Tamu",
      roomNumber: room.roomNumber,
      location: room.location,
      price: room.price,
      status: "pending" as const,
      entryDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      paymentStatus: "Belum Lunas" as const
    };

    // Update room availability
    room.isAvailable = false;
    room.tenantId = newBooking.tenantId;

    // Check if user exists, if not, create mock tenant or update role
    let user = dbUsers.find(u => u.id === tenantId);
    if (user) {
      user.role = "tenant";
      user.roomNumber = room.roomNumber;
    } else {
      user = {
        id: newBooking.tenantId,
        name: newBooking.tenantName,
        email: email || `${newBooking.tenantName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        role: "tenant",
        roomNumber: room.roomNumber,
        entryDate: newBooking.entryDate
      };
      dbUsers.push(user);
    }

    dbBookings.push(newBooking);

    // Create Notification
    dbNotifications.unshift({
      id: "n_" + Math.random().toString(36).substring(2, 9),
      title: "Booking Kamar Berhasil",
      message: `Permintaan booking untuk kamar ${room.roomNumber} di lokasi ${room.location} sedang menunggu pembayaran.`,
      type: "booking",
      createdAt: new Date().toISOString(),
      isRead: false
    });

    res.json({ success: true, booking: newBooking, user });
  });

  // Bookings - Submit Payment Receipt
  app.post("/api/bookings/:id/pay", (req, res) => {
    const { id } = req.params;
    const { paymentMethod, paymentProof } = req.body;
    const booking = dbBookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
    }

    booking.paymentStatus = "Menunggu Konfirmasi";
    booking.paymentMethod = paymentMethod;
    booking.paymentProof = paymentProof || "https://lh3.googleusercontent.com/dummy-receipt.png";

    // Add general transaction alert to notification log
    dbNotifications.unshift({
      id: "n_" + Math.random().toString(36).substring(2, 9),
      title: "Konfirmasi Pembayaran",
      message: `Pembayaran sewa oleh ${booking.tenantName} untuk kamar ${booking.roomNumber} sedang diperiksa Admin.`,
      type: "payment",
      createdAt: new Date().toISOString(),
      isRead: false
    });

    res.json({ success: true, booking });
  });

  // Bookings - Approve Booking / Payment
  app.post("/api/bookings/:id/approve", (req, res) => {
    const { id } = req.params;
    const booking = dbBookings.find(b => b.id === id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking tidak ditemukan" });
    }

    booking.paymentStatus = "Lunas";
    booking.status = "active";

    // Create income Transaction
    const txId = "t_" + Math.random().toString(36).substring(2, 9);
    dbTransactions.unshift({
      id: txId,
      date: new Date().toISOString().split('T')[0],
      category: 'PEMASUKAN',
      title: `Sewa ${booking.roomNumber} - ${booking.tenantName}`,
      description: `Pembayaran disetujui lewat portal ${booking.paymentMethod || 'QRIS'}`,
      status: 'Berhasil',
      amount: booking.price,
      paymentMethod: booking.paymentMethod || 'QRIS'
    });

    // Notify Tenant
    dbNotifications.unshift({
      id: "n_" + Math.random().toString(36).substring(2, 9),
      title: "Pembayaran Diterima!",
      message: `Sewa kamar ${booking.roomNumber} Anda di ${booking.location} telah Lunas. Selamat datang!`,
      type: "payment",
      createdAt: new Date().toISOString(),
      isRead: false
    });

    res.json({ success: true, booking });
  });

  // Reports - Submit Lapor Kerusakan
  app.post("/api/reports", (req, res) => {
    const { tenantId, tenantName, roomNumber, title, description } = req.body;
    const newReport = {
      id: "rep_" + Math.random().toString(36).substring(2, 9),
      tenantId: tenantId || "unknown",
      tenantName: tenantName || "Penghuni",
      roomNumber: roomNumber || "Kamar",
      title,
      description,
      status: 'Pending' as const,
      createdAt: new Date().toISOString()
    };

    dbReports.unshift(newReport);

    // Notify maintenance alert
    dbNotifications.unshift({
      id: "n_" + Math.random().toString(36).substring(2, 9),
      title: "Laporan Kerusakan Baru",
      message: `Laporan kerusakan "${title}" diajukan oleh kamar ${roomNumber}.`,
      type: "maintenance",
      createdAt: new Date().toISOString(),
      isRead: false
    });

    res.json({ success: true, report: newReport });
  });

  // Reports - Update status
  app.post("/api/reports/:id/update", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const report = dbReports.find(r => r.id === id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Laporan tidak ditemukan" });
    }

    report.status = status;
    res.json({ success: true, report });
  });

  // Notifications - Push custom simulated alert
  app.post("/api/notifications/add", (req, res) => {
    const { title, message, type } = req.body;
    const newNotify = {
      id: "n_" + Math.random().toString(36).substring(2, 9),
      title: title || "Pemberitahuan Baru",
      message: message || "Ada perkembangan informasi terbaru mengenai hunian.",
      type: type || "system",
      createdAt: new Date().toISOString(),
      isRead: false
    };

    dbNotifications.unshift(newNotify);
    res.json({ success: true, notification: newNotify });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
