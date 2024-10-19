import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import './Translator.css';

const Translator = () => {
    const [selectedSourceLanguage, setSelectedSourceLanguage] = useState(null);
    const [selectedTargetLanguage, setSelectedTargetLanguage] = useState(null);
    const [textToTranslate, setTextToTranslate] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    const languages = [
        { label: 'Afrikáans', code: 'af' },
        { label: 'Árabe', code: 'ar' },
        { label: 'Bengalí', code: 'bn' },
        { label: 'Checo', code: 'cs' },
        { label: 'Danés', code: 'da' },
        { label: 'Español', code: 'es' },
        { label: 'Neerlandés', code: 'nl' },
        { label: 'Inglés', code: 'en' },
        { label: 'Francés', code: 'fr' },
        { label: 'Alemán', code: 'de' },
        { label: 'Griego', code: 'el' },
        { label: 'Hindi', code: 'hi' },
        { label: 'Húngaro', code: 'hu' },
        { label: 'Indonesio', code: 'id' },
        { label: 'Italiano', code: 'it' },
        { label: 'Japonés', code: 'ja' },
        { label: 'Coreano', code: 'ko' },
        { label: 'Noruego', code: 'no' },
        { label: 'Polaco', code: 'pl' },
        { label: 'Portugués', code: 'pt' },
        { label: 'Ruso', code: 'ru' },
        { label: 'Sueco', code: 'sv' },
        { label: 'Turco', code: 'tr' },
        { label: 'Chino (Simplificado)', code: 'zh' },
        { label: 'Chino (Tradicional)', code: 'zh-TW' },
        { label: 'Vietnamita', code: 'vi' }
    ];

    const handleTranslate = async () => {
        try {
            const response = await fetch('http://localhost:5000/translator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textToTranslate,
                    sourceLanguage: selectedSourceLanguage.code,
                    targetLanguage: selectedTargetLanguage.code,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la traducción');
            }

            const data = await response.json();
            setTranslatedText(data.translatedText);
        } catch (error) {
            console.error(error);
            setTranslatedText('Error al traducir el texto.');
        }
    };

    return (
        <div className="translator-container">
            <h2>Traductor MedycSync</h2>
            <h3>Traductor de recetas médicas</h3>
            
            {/* Contenedor para los dropdowns de idioma */}
            <div className="language-selection">
                {/* Selección de idioma de origen */}
                <div className="input-field">
                    <label htmlFor="sourceLanguage">Idioma de Origen</label>
                    <Dropdown 
                        id="sourceLanguage" 
                        value={selectedSourceLanguage} 
                        options={languages} 
                        onChange={(e) => setSelectedSourceLanguage(e.value)} 
                        placeholder="Selecciona un idioma de origen"
                    />
                </div>

                {/* Selección de idioma de destino */}
                <div className="input-field">
                    <label htmlFor="targetLanguage">Idioma de Destino</label>
                    <Dropdown 
                        id="targetLanguage" 
                        value={selectedTargetLanguage} 
                        options={languages} 
                        onChange={(e) => setSelectedTargetLanguage(e.value)} 
                        placeholder="Selecciona un idioma de destino"
                    />
                </div>
            </div>

            {/* Área de texto para introducir el texto */}
            <div className="input-field">
                <label htmlFor="text">Texto a Traducir</label>
                <InputTextarea 
                    id="text" 
                    value={textToTranslate} 
                    onChange={(e) => setTextToTranslate(e.target.value)} 
                    rows={4} 
                    placeholder="Escribe el texto aquí"
                    style={{ maxHeight: '150px', overflowY: 'auto' }} // Añadir estilo directamente aquí
                />
            </div>

            {/* Botón para traducir */}
            <Button 
                label="Traducir" 
                className="p-button-rounded p-button-block" 
                onClick={handleTranslate} 
                disabled={!selectedSourceLanguage || !selectedTargetLanguage || !textToTranslate}
                style={{ marginTop: '1rem' }}
            />

            {/* Mostrar la traducción, visible siempre */}
            <div className="translation-result">
                <h3>Traducción:</h3>
                <p style={{ fontSize: '1rem' }}>{translatedText || "La traducción aparecerá aquí."}</p>
            </div>
        </div>
    );
};

export default Translator;
