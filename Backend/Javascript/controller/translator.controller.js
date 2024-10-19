const AWS = require('aws-sdk');

const translate = new AWS.Translate({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_TRANSLATOR,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TRANSLATOR,
    region: process.env.AWS_REGION_TRANSLATOR
});

const translateText = async (req, res) => {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({ error: 'Faltan datos de entrada' });
    }

    const params = {
        Text: text,
        SourceLanguageCode: sourceLanguage,
        TargetLanguageCode: targetLanguage
    };

    try {
        const data = await translate.translateText(params).promise();
        return res.json({ translatedText: data.TranslatedText });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error en la traducción' });
    }
};

module.exports = { translateText };
