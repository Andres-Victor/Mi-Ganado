
        function showReviewPopup() {
            const popup = document.getElementById('reviewPopup');
            popup.classList.add('active');
        }
        // ===== CLOSE PAGE =====
        function closePage() 
        {
            window.location.href = `index.html`;
        }

        // ===== CONTACT SUPPORT =====
        function contactSupport() {
            // Replace with your support email or contact link
            window.open(`contactUs.html`, '_blank');
        }
        // ===== CURRENCY CONVERSION TABLE =====
        const currencyRates = 
        {
            'US': { symbol: 'US$', rate: 1, label: 'USD', locale: 'en-US'},
            'CO': { symbol: 'COP$', rate: 3600, label: 'COP', locale: 'es-CO', 'rounded': true},
            'MX': { symbol: 'MXN$', rate: 17, label: 'MXN', locale: 'es-MX', 'rounded': true},
            'VE': { symbol: 'VES$', rate: 738, label: 'VES', locale: 'es-VE', 'rounded': true}
        };

        // ===== PAYMENT DATA =====
        const paymentData = 
        {
            pagomovil: {
                icon: '📱',
                id: 'pagomovil',
                name: 'PagoMovil',
                data: [
                    { label: 'Banco', value: 'Banco Mercantil' },
                    { label: 'Cédula', value: '31.754.601' },
                    { label: 'Teléfono', value: '04144746323' }
                ]
            },
            paypal: 
            {
                icon: '🅿️',
                id: 'paypal',
                name: 'PayPal',
                data: 
                [
                    { label: 'Enlace', value: 'paypal.me/miganado', onTapLink: (amount) => `https://paypal.me/miganado/${amount}` },
                ]
            },
            binance: 
            {
                icon: '₿',
                id: 'binance',
                name: 'Binance',
                data: [
                    { label: 'UID', value: '804746784' },
                    { label: 'Correo', value: 'vianvarela@gmail.com' },
                    { label: 'Moneda', value: 'Tether USD (USDT)' }
                ]
            },
        };

        // ===== STATE MANAGEMENT =====
        let state = {
            membership: null,
            paymentMethod: null,
            currency: null,
            prices: { monthly: 7.99, annual: 59.99 }
        };

        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', () => 
        {
            detectUserCountry();
        });

        function formatMoney(value) 
        {
          // Convert to cents and truncate extra fractions
          const totalCents = Math.floor(value * 100);
          const dollars = Math.floor(totalCents / 100);
          const cents = totalCents % 100;
          // Ensure two‑digit cent display
          return `$${dollars}.${cents.toString().padStart(2, '0')}`;
        }

        function convertNumberToCurrency(number) 
        {
            // 1. Guardarraíl al principio
            if (typeof number !== 'number' && typeof number !== 'string') {
                return number;
            }
        
            const parsedInput = Number(number);
            if (Number.isNaN(parsedInput)) {
                return number;
            }
        
            // 2. Obtener tasas y configuraciones
            const rate = currencyRates[state.currency] ?? currencyRates['US'];
            const alwaysShowDecimals = rate.rounded !== true;
        
            // 3. Extracción exacta de unidades y centavos truncados
            const totalCents = Math.floor(parsedInput * 100);
            const unidades = Math.floor(totalCents / 100);
            const centavos = totalCents % 100;
        
            // 4. Formatear las unidades con el locale (sin decimales de JS)
            const unidadesFormateadas = unidades.toLocaleString(rate.locale, { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
            });
        
            // 5. Retornar con o sin centavos según la tasa, asegurando el cero a la izquierda
            if (alwaysShowDecimals) {
                // Obtenemos el separador decimal dinámico del locale (coma o punto)
                const decimalSeparator = (1.1).toLocaleString(rate.locale).substring(1, 2);
                const centavosString = String(centavos).padStart(2, '0');

                return `${unidadesFormateadas}${decimalSeparator}${centavosString}`;
            }
        
            return unidadesFormateadas;
        }

        // ===== GEOLOCATION =====
        async function detectUserCountry() 
        {
            const cacheKey = 'user_location';
            const TTL = 1000 * 60 * 60; // 1 hour

            try {
                // Check localStorage cache first
                const raw = localStorage.getItem(cacheKey);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed && parsed.ts && (Date.now() - parsed.ts) < TTL && parsed.countryCode) {
                            const countryCode = parsed.countryCode;
                            // Use cached location
                            if (currencyRates[countryCode]) {
                                state.currency = countryCode;
                                const value = await getRegionalPrice(currencyRates[countryCode].label);
                                if (value) currencyRates[countryCode].rate = value;
                            }
                            else 
                            {
                                state.currency = 'US';
                            }
                            updateCurrency();
                            if (countryCode === 'VE') document.getElementById('pagomovil-option').style.display = 'block';
                            hideLoadingPopup();
                            console.log('Usando ubicación cacheada:', countryCode);
                            return;
                        }
                    } catch (e) {
                        // ignore parse errors and continue to fetch
                    }
                }

                // If no valid cache, fetch location
                const response = await fetch('https://freeipapi.com/api/json');
                const data = await response.json();
                const countryCode = data.countryCode;

                // Save to cache
                try {
                    localStorage.setItem(cacheKey, JSON.stringify({ countryCode, ts: Date.now() }));
                } catch (e) {
                    // ignore storage errors
                }

                // Set currency based on country
                if (currencyRates[countryCode]) {
                    state.currency = countryCode;
                    const value = await getRegionalPrice(currencyRates[countryCode].label);
                    if (value) currencyRates[countryCode].rate = value;
                } else {
                    state.currency = 'US'; // Default to USD
                }

                // Update UI with location and prices
                updateCurrency();

                // Show PagoMovil only for Venezuela
                if (countryCode === 'VE') {
                    document.getElementById('pagomovil-option').style.display = 'block';
                }

                // Hide loading popup
                hideLoadingPopup();
            } catch (error) {
                // Default to USD if geolocation fails
                console.log(`Error al obtener la ubicación: ${error}`)
                state.currency = 'US';
                updateCurrency();
                if (state.currency === 'VE') 
                {
                    document.getElementById('pagomovil-option').style.display = 'block';
                }
                hideLoadingPopup();
            } finally {
                console.log('Geolocalización finalizada. País detectado:', state.currency);
            }
        }

       async function getRegionalPrice(fiatCurrency) 
       {
            if (fiatCurrency === 'USD') return 1;

            if(fiatCurrency !== 'VES') return null; // Solo tenemos precio regional para VES, para los demás países usamos la tasa fija

            // Cache key and TTL (1 hour)
            const cacheKey = `budt_${fiatCurrency}`;
            const TTL = 1000 * 60 * 60;
            try 
            {
                // Check localStorage cache
                const raw = localStorage.getItem(cacheKey);
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed && parsed.ts && (Date.now() - parsed.ts) < TTL && parsed.precio != null) {
                            // Use cached value
                            console.log(`Usando cache para ${fiatCurrency}: ${parsed.precio}`);
                            return parsed.precio;
                        }
                    } catch (e) {
                        // ignore parse errors and refetch
                    }
                }
                // Use la nueva URL que le dé Google al publicar
                const baseUrl = "https://script.google.com/macros/s/AKfycbyWbKTJmxSo1U2BfBN6GxxYUXoQvIHybMPblt0pLFwyWGjMJ18Q5jbvj59dwkSuBhDc9A/exec";
                const url = `${baseUrl}?fiat=${fiatCurrency}&asset=USDT&tradeType=BUY`;
                const response = await fetch(url); // Por defecto es GET
                if (!response.ok) throw new Error("Error en red");
                const data = await response.json();

                if (data.success && data.data && data.data.length > 0) 
                {
                    const precioRaw = data.data[0].adv.price;
                    const precio = parseFloat(precioRaw);
                    try 
                    {
                        localStorage.setItem(cacheKey, JSON.stringify({ precio, ts: Date.now() }));
                    } catch (e) {}
                    console.log(`Precio para ${fiatCurrency}: ${precio}`);
                    return precio;
                } 
                else if (data.success && data.source === 'fallback_firebase')
                {
                    const precio = parseFloat(data.price);
                    try 
                    {
                        localStorage.setItem(cacheKey, JSON.stringify({ precio, ts: Date.now() }));
                    } catch (e) {}
                    return data.price;
                }
                else 
                {
                    return null;
                }
            } catch (error) {
                console.error("Error en la petición:", error);
                return null;
            }
        }


        function updateCurrency() 
        {
            const rate = currencyRates[state.currency] ?? currencyRates['US'];
            
            // Update prices
            // Calculate numeric values first
            var monthlyNum = Math.round(state.prices.monthly * rate.rate * 100) / 100;
            var annualNum = Math.round(state.prices.annual * rate.rate * 100) / 100;
            var saved = monthlyNum * 12 - annualNum;
            var anualMonthlyEquivalent = annualNum / 12;

            // If rounded flag, round to nearest 10 (e.g., 43852.69 -> 43850, 43856.69 -> 43860)
            if (rate.rounded) 
            {
                monthlyNum = Math.round(monthlyNum / 10) * 10;
                annualNum = Math.round(annualNum / 10) * 10;
                anualMonthlyEquivalent = annualNum / 12;
                saved = monthlyNum * 12 - (anualMonthlyEquivalent * 12);
            }




            // Convert to currency strings
            var monthlyConverted = convertNumberToCurrency(monthlyNum);
            var annualConverted = convertNumberToCurrency(annualNum);
            var anualMonthlyEquivalentConverted = convertNumberToCurrency(anualMonthlyEquivalent);

            
            document.getElementById('monthlyPrice').textContent = rate.symbol +' '+ monthlyConverted;
            document.getElementById('annualPrice').textContent = rate.symbol +' '+ anualMonthlyEquivalentConverted;
            document.getElementById('annualBadge').textContent = `-${Math.round((1 - anualMonthlyEquivalent / monthlyNum) * 100)}%`;
            document.getElementById('annualPriceBefore').textContent = `${rate.symbol} ${convertNumberToCurrency(monthlyNum)}`;
            document.getElementById('annualSaved').textContent = `Ahorre ${rate.symbol} ${convertNumberToCurrency(saved)}`;
            document.getElementById('finalPaymentAdvice').textContent = `Facturado anualmente como un unico pago de ${rate.symbol} ${annualConverted}.`;

            
            if (state.membership === 'monthly') 
            {
                document.getElementById('totalPrice').textContent = rate.symbol +' '+monthlyConverted;
                document.getElementById('pricePeriod').textContent = 'por este mes';
                document.getElementById('priceCopy').onclick = () => copyPaymentData(monthlyNum, document.getElementById('priceCopy'));
                document.getElementById('planName').textContent = 'Mensual';
            } else if (state.membership === 'annual') 
            {
                document.getElementById('totalPrice').textContent = rate.symbol +' '+annualConverted;
                document.getElementById('pricePeriod').innerHTML = `por este año`;
                document.getElementById('priceCopy').onclick = () => copyPaymentData(annualNum, document.getElementById('priceCopy'));
                document.getElementById('planName').textContent = 'Anual';
            }
        }

        function hideLoadingPopup() 
        {
            const popup = document.getElementById('loadingPopup');
            popup.classList.add('hidden');
            setTimeout(() => {
                popup.style.display = 'none';
            }, 300);
        }

        // ===== MEMBERSHIP SELECTION =====
        function selectMembership(type) 
        {
            // Remove selection from all cards
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            state.membership = type;

            // Update price display
            updateCurrency();

            // Enable next button
            document.getElementById('btn-next-1').disabled = false;
            goToStep2();
        }

        // ===== PAYMENT METHOD SELECTION =====
       // ===== PAYMENT METHOD SELECTION =====
        function selectPaymentMethod(method, element) 
        {
            // Remove selection from all options
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });

            // Add selection to clicked option
            element.classList.add('selected');
            state.paymentMethod = method;

            // Update method name
            document.getElementById('methodName').textContent = paymentData[method].name;

            // Show/hide bank info based on method
            const bankInfo = document.getElementById('bankInfo');

            bankInfo.style.display = 'none';

            displayPaymentInfo(bankInfo, method);   
            displayPaymentForm(method);
            
            goToStep3();
        }



        function displayPaymentInfo(container, method) 
        {
            const data = paymentData[method].data.slice();
            container.style.display = 'block';
            
            // Clear existing rows (except header)
            const rows = container.querySelectorAll('.bank-info-row');
            rows.forEach(row => row.remove());
            
            // Add new rows based on payment method data
            data.forEach((item, index) => 
            {
                const row = document.createElement('div');
                row.className = 'bank-info-row';
                
                let rowContent = `<span class="bank-info-label">${item.label}:</span>`;
                
                if (item.onTapLink) 
                {
                    // For PayPal, create clickable link with amount
                    const rate = currencyRates[state.currency];
                    const amount = state.membership === 'monthly' ? state.prices.monthly : state.prices.annual;
                    const link = item.onTapLink(amount);
                    const usdAmount = state.currency !== 'US' ? ` (US$ ${amount})` : '';
                    
                    rowContent += `<a href="${link}" target="_blank" class="bank-info-value" style="color: var(--primary-blue); cursor: pointer; text-decoration: none;">
                        ${item.value}${usdAmount}<span style="color: var(--text-gray); margin-left: 5px;">↗</span>
                    </a>`;
                } else {
                    rowContent += `<span class="bank-info-value" id="${method}-data-${index}">${item.value}</span>
                        <button class="copy-button" onclick="copyPaymentData('${item.value}', this)">Copiar</button>`;
                }
                
                row.innerHTML = rowContent;
                container.appendChild(row);
            });
            
            // Update header title
            if (method === 'pagomovil') 
            {
                container.querySelector('h4').textContent = 'Datos PagoMovil';
            } else if (method === 'binance') {
                container.querySelector('h4').textContent = 'Datos de Binance';
            } else if (method === 'paypal') {
                container.querySelector('h4').textContent = 'Datos de PayPal';
            }
        }

        function displayPaymentForm(method) 
        {
            const form = document.querySelector('#payment-form-section');
            const emissor_mail = form.querySelector('#email-emisor-form');
            const reference_code = form.querySelector('#reference-code-form');
            const reference_file = form.querySelector('#reference-upload-form');

            if(method !== 'pagomovil')
            {
                reference_code.innerHTML = '';
                reference_file.innerHTML = '';
            }
            else
            {
                emissor_mail.innerHTML = '';
            }
        }



        // ===== FILE UPLOAD =====
        document.getElementById('file-upload').addEventListener('change', function(e) 
        {
            const fileInput = e.target;

            if(fileInput.files[0] == undefined) return;

            const file = fileInput.files[0];
            const fileName = file?.name;
            const fileNameElement = document.getElementById('file-name');
            const previewElement = document.getElementById('image-preview');

            if (fileName) 
            {
                fileNameElement.textContent = '✓ ' + fileName;
            } else {
                fileNameElement.textContent = '';
            }

            if (file && file.type.startsWith('image/')) {
                previewElement.innerHTML = '';
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.alt = 'Vista previa del comprobante de pago';
                img.onload = () => URL.revokeObjectURL(img.src);
                previewElement.appendChild(img);
                previewElement.style.display = 'block';
            } else {
                previewElement.innerHTML = '';
                previewElement.style.display = 'none';
            }
        });

        // ===== COPY TO CLIPBOARD =====
        function copyToClipboard(elementId) {
            const element = document.getElementById(elementId);
            const text = element.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✓ Copiado';
                
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.log('[v0] Copy error:', err);
            });
        }

        function copyPaymentData(text, self) 
        {
            navigator.clipboard.writeText(text).then(() => 
            {
                const button = self || event.target;
                const originalText = button.textContent;
                button.textContent = '✓ Copiado';

                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.log('Copy error:', err);
            });
        }

        // ===== EXECUTE PAYMENT =====
        async function executePayment() 
        {
            const text = element.textContent;
            navigator.clipboard.writeText(text).then(() => 
            {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✓ Copiado';

                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.log('Copy error:', err);
            });
        }

        // ===== EXECUTE PAYMENT =====
        async function executePayment() 
        {
            const fileInput = document.getElementById('file-upload');
            const file = fileInput?.files[0];
            const mi_ganado_email = document.getElementById('email').value;
            const emissor_email = document.getElementById('email-emisor').value;
            const referenceCode = document.getElementById('reference-code')?.value;
            const paymentDate = document.getElementById('payment-date').value;

            if (!mi_ganado_email || !paymentDate) {
                alert('Por indique su correo de mi ganado y la fecha de pago');
                return;
            }

            if(state.paymentMethod === 'pagomovil')
            {
                if(!file && !referenceCode)
                {
                    alert('Por favor incluya el numero de transacción o un comprobante de pago');
                }
            }
            else
            {
                if(!emissor_email)
                {
                    alert('Por favor indique el correo electrónico de la cuenta con la que realizó el pago');
                }
            }

            const webhook_part_one = 'https://disc';
            const webhook_part_two = 'ord.com/api/webhooks/1508654073472221367/';
            const webhook_part_tree = 'eHtJdnFrltE5SZQahbvD4cnKgjfiIGFtfbkpu4Ek2m_oYyDGecFkJ-ETK_InjRtge1aI';
        
            const discordWebhookUrl = webhook_part_one + webhook_part_two + webhook_part_tree;
            
            const membershipType = state.membership;
            const paymentMethod = state.paymentMethod;
            const currency = state.currency;
            const amount = membershipType === 'monthly' ? state.prices.monthly : state.prices.annual;
            const rate = currencyRates[currency]?.rate || 1;
            const symbol = currencyRates[currency]?.symbol || '';
            var convertedAmount = Math.round(amount * rate * 100) / 100;

            if(currencyRates[currency]?.rounded)
            {
                convertedAmount = Math.round(convertedAmount / 10) * 10;
            }

            const amountLabel = `${symbol} ${convertedAmount} (USD ${amount})`;
            // Construimos el Embed con toda la información
            const embedPayload = {
                embeds: [
                    {
                        title: '✨ Pago registrado',
                        description: 'Se ha recibido un comprobante para activación o renovación.',
                        color: 65280,
                        fields: [
                            { name: '📧 Email Emisor', value: emissor_email, inline: true },
                            { name: '📧 Email Mi Ganado', value: mi_ganado_email, inline: true },
                            { name: '🔢 Ref.', value: referenceCode, inline: true },
                            { name: '📆 Fecha', value: paymentDate, inline: true },
                            { name: '💳 Método', value: paymentMethod, inline: true },
                            { name: '🏷️ Membresía', value: membershipType, inline: true },
                            { name: '💱 Moneda', value: currency, inline: true },
                            { name: '💰 Monto', value: amountLabel, inline: true }
                        ],
                        footer: {
                            text: 'Mi Ganado Web - Activación/Renovación'
                        },
                        timestamp: new Date().toISOString()
                    }]
            };
        
            const formData = new FormData();
            if(file) formData.append('file', file, 'comprobante.png');
            formData.append('payload_json', JSON.stringify(embedPayload));
        
            try {
                const response = await fetch(discordWebhookUrl, {
                    method: 'POST',
                    body: formData
                });
            
                if (response.ok) {
                    showReviewPopup();
                } else {
                    throw new Error('Error al enviar al webhook');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error al procesar el envío. Intente de nuevo.');
            }
        }


        // ===== NAVIGATION =====
        function showScreen(screenNumber) 
        {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });

            document.querySelectorAll('.step').forEach(step => {
                step.classList.remove('active');
            });

            if (screenNumber === 1) {
                document.getElementById('screen1').classList.add('active');
                document.getElementById('step1-indicator').classList.add('active');
            } else if (screenNumber === 2) {
                document.getElementById('screen2').classList.add('active');
                document.getElementById('step2-indicator').classList.add('active');
            } else if (screenNumber === 3) {
                document.getElementById('screen3').classList.add('active');
                document.getElementById('step3-indicator').classList.add('active');
            }
        }

        function goToStep1() {
            showScreen(1);
        }

        function goToStep2() {
            if (!state.membership) {
                alert('Por favor selecciona una membresía');
                return;
            }
            showScreen(2);
        }

        function goToStep3() {
            if (!state.paymentMethod) {
                alert('Por favor selecciona un método de pago');
                return;
            }
            showScreen(3);
        }
    