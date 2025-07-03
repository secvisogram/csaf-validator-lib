# python scrip to generate the translation of 'license' in all supported languages from google translate
import asyncio
import json
import time
from googletrans import Translator
from googletrans import LANGUAGES
translator = Translator()

async def TranslateText():
    translations = {}

    for language in LANGUAGES:
      translated = await translator.translate('license', dest=language)
      translations[language] = translated.text
      time.sleep(1) # wait in order not to exceed the quota of google translate

    translations_json = json.dumps(translations)
    print(translations_json)


asyncio.run(TranslateText())