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
            const response = await fetch('http://localhost:4000/translate', {
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

    const handleListenText = async (text) => {
        try {
            const response = await fetch('http://localhost:4000/speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
    
            if (!response.ok) {
                throw new Error('Error al generar el audio');
            }
    
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
    
            const audio = new Audio(audioUrl);
            audio.play();
    
            audio.onplay = () => {
                console.log('Audio started playing');
            };
    
            audio.onerror = (e) => {
                console.error('Error playing audio:', e);
            };
    
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="translator-container">
            <h2>Traductor MedycSync</h2>
            <h3>Traductor de recetas médicas</h3>
            
            <div className="language-selection">
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

            <div className="input-field">
                <label htmlFor="text">Texto a Traducir</label>
                <InputTextarea 
                    id="text" 
                    value={textToTranslate} 
                    onChange={(e) => setTextToTranslate(e.target.value)} 
                    rows={4} 
                    placeholder="Escribe el texto aquí"
                    style={{ maxHeight: '150px', overflowY: 'auto' }} 
                />
            </div>

            <Button 
                label="Traducir" 
                className="p-button-rounded p-button-block" 
                onClick={handleTranslate} 
                disabled={!selectedSourceLanguage || !selectedTargetLanguage || !textToTranslate}
                style={{ marginTop: '1rem' }}
            />

            <div className="audio-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <Button 
                    label="Escuchar Texto Original" 
                    onClick={() => handleListenText(textToTranslate)} 
                    disabled={!textToTranslate} 
                    className="p-button-rounded"
                />
                <Button 
                    label="Escuchar Traducción" 
                    onClick={() => handleListenText(translatedText)} 
                    disabled={!translatedText} 
                    className="p-button-rounded"
                />
            </div>

            <div className="translation-result" style={{ marginTop: '1rem' }}>
                <h3>Traducción:</h3>
                <p style={{ fontSize: '1rem' }}>{translatedText || "La traducción aparecerá aquí."}</p>
            </div>
        </div>
    );
};

export default Translator;
