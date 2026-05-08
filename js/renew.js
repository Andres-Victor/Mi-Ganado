
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
            'CO': { symbol: '$', rate: 3800, label: 'COP', locale: 'es-CO'},
            'MX': { symbol: '$', rate: 17, label: 'MXN', locale: 'es-MX'},
            'VE': { symbol: 'Bs', rate: 670, label: 'VES', locale: 'es-VE'}
        };

        // ===== PAYMENT DATA =====
        const paymentData = 
        {
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
            pagomovil: {
                icon: '📱',
                id: 'pagomovil',
                name: 'PagoMovil',
                data: [
                    { label: 'Banco', value: 'Banco Mercantil' },
                    { label: 'Cédula', value: '31.754.601' },
                    { label: 'Teléfono', value: '04144746323' }
                ]
            }
        };

        // ===== STATE MANAGEMENT =====
        let state = {
            membership: null,
            paymentMethod: null,
            currency: null,
            prices: { monthly: 8, annual: 60 }
        };

        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', () => {
            detectUserCountry();
        });

        function convertNumberToCurrency(number)
        {
            if (typeof number !== 'number' && typeof number !== 'string') 
            {
                return number;
            }

            const parsedNumber = Number(number);
            if (Number.isNaN(parsedNumber)) {
                return number;
            }

            return parsedNumber.toLocaleString('es-VE');
        }

        // ===== GEOLOCATION =====
        async function detectUserCountry() 
        {
            try 
            {
                const response = await fetch('http://ip-api.com/json/');
                const data = await response.json();
                const countryCode = data.countryCode;
                
                console.log('[v0] Detected country:', countryCode);

                // Set currency based on country
                if (currencyRates[countryCode]) 
                {
                    state.currency = countryCode;
                    var value = await getBinanceUSDTFor(currencyRates[countryCode].label);
                    console.log('Valor de USDT en moneda local:', value);
                } 
                else 
                {
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
            } 
            catch (error) 
            {
                console.log('[v0] Geolocation error:', error);
                // Default to USD if geolocation fails
                state.currency = 'US';
                updateCurrency();
                hideLoadingPopup();
            }
        }

        async function getBinanceUSDTFor(fiatCurrency) 
        {
          const url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

          const payload = 
          {
            asset: "USDT",
            fiat: fiatCurrency,
            tradeType: "BUY", // "BUY" para ver a cuánto venden los comerciantes
            bank: [],
            page: 1,
            rows: 1, // Solo necesitamos el primer resultado para el precio más bajo
            payTypes: [],
            publisherType: null,
            tradeType: "BUY"
          };
      
          try 
          {
            const response = await fetch(url, 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
              },
              body: JSON.stringify(payload)
            });
        
            const data = await response.json();
        
            if (data.success) 
            {
              const precio = data.data[0].adv.price;
              return precio;
            } 
            else 
            {
              console.error("Error en la respuesta de Binance");
              return null; // Retorna null si la respuesta no es exitosa
            }
          } 
          catch (error) 
          {
            return null; // Retorna null si hay un error en la petición
            console.error("Error en la petición:", error);
          }
        }


        function updateCurrency() 
        {
            const rate = currencyRates[state.currency] ?? { symbol: '$', rate: 1 };
            
            // Update prices
            const monthlyConverted = convertNumberToCurrency(Math.round(state.prices.monthly * rate.rate * 100) / 100);
            const annualConverted = convertNumberToCurrency(Math.round(state.prices.annual * rate.rate * 100) / 100);
            
            document.getElementById('monthlyPrice').textContent = rate.symbol +' '+ monthlyConverted;
            document.getElementById('annualPrice').textContent = rate.symbol +' '+ annualConverted;
            document.getElementById('annualBadge').textContent = `¡Te ahorras ${rate.symbol}${convertNumberToCurrency(Math.round((state.prices.monthly * 12 - state.prices.annual) * rate.rate * 100) / 100)} al año!`;


            
            if (state.membership === 'monthly') 
            {
                document.getElementById('totalPrice').textContent = rate.symbol +' '+monthlyConverted;
                document.getElementById('pricePeriod').textContent = 'por mes';
            } else if (state.membership === 'annual') 
            {
                document.getElementById('totalPrice').textContent = rate.symbol +' '+annualConverted;
                document.getElementById('pricePeriod').textContent = 'por año';
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
        function selectMembership(type, element) 
        {
            // Remove selection from all cards
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('selected');
            });

            // Add selection to clicked card
            element.classList.add('selected');
            state.membership = type;

            // Update price display
            const rate = currencyRates[state.currency] ?? { symbol: '$', rate: 1 };
            if (type === 'monthly') {
                const monthlyConverted =  convertNumberToCurrency(Math.round(state.prices.monthly * rate.rate * 100) / 100);
                document.getElementById('totalPrice').textContent = rate.symbol +' '+ monthlyConverted;
                document.getElementById('pricePeriod').textContent = 'por mes';
                document.getElementById('planName').textContent = 'Mensual';
            } else {
                const annualConverted = convertNumberToCurrency(Math.round(state.prices.annual * rate.rate * 100) / 100);
                document.getElementById('totalPrice').textContent = rate.symbol +' '+ annualConverted;
                document.getElementById('pricePeriod').textContent = 'por año';
                document.getElementById('planName').textContent = 'Anual';
            }

            // Enable next button
            document.getElementById('btn-next-1').disabled = false;
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

            // Enable next button
            document.getElementById('btn-next-2').disabled = false;
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
                    const usdAmount = state.currency !== 'US' ? ` (${amount} USD)` : '';
                    
                    rowContent += `<a href="${link}" target="_blank" class="bank-info-value" style="color: var(--primary-blue); cursor: pointer; text-decoration: none;">
                        ${item.value}${usdAmount}<span style="color: var(--text-gray); margin-left: 5px;">↗</span>
                    </a>`;
                } else {
                    rowContent += `<span class="bank-info-value" id="${method}-data-${index}">${item.value}</span>
                        <button class="copy-button" onclick="copyPaymentData('${method}', ${index})">Copiar</button>`;
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

        // ===== EXECUTE PAYMENT =====
        async function executePayment() 
        {
            const fileInput = document.getElementById('file-upload');
            const file = fileInput.files[0];
            const email = document.getElementById('email').value;
             const referenceCode = document.getElementById('reference-code').value;
            const paymentDate = document.getElementById('payment-date').value;
        
            if (!email || !paymentDate || !file) {
                alert('Por indique su correo, fecha de pago y imagen de comprobante');
                return;
            }
        
        
            const discordWebhookUrl = 'https://discord.com/api/webhooks/1502169752972431360/k15mU454r4ppBe3gxcEW6sABmQTl9tQLsjZOjQGhQFy4YzJrxnZYHiUSDCkMlVxDSBgi';
            
            const membershipType = state.membership;
            const paymentMethod = state.paymentMethod;
            const currency = state.currency;
            const amount = membershipType === 'monthly' ? state.prices.monthly : state.prices.annual;
            const rate = currencyRates[currency]?.rate || 1;
            const symbol = currencyRates[currency]?.symbol || '';
            const convertedAmount = Math.round(amount * rate * 100) / 100;
            const amountLabel = `${symbol} ${convertedAmount} (USD ${amount})`;
            // Construimos el Embed con toda la información
            const embedPayload = {
                embeds: [
                    {
                        title: '✨ Pago registrado',
                        description: 'Se ha recibido un comprobante para activación o renovación.',
                        color: 65280,
                        fields: [
                            { name: '📧 Email', value: email, inline: true },
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
            formData.append('file', file, 'comprobante.png');
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
                document.getElementById('btn-next-1').disabled = true;
            } else if (screenNumber === 2) {
                document.getElementById('screen2').classList.add('active');
                document.getElementById('step2-indicator').classList.add('active');
                document.getElementById('btn-next-2').disabled = true;
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
    