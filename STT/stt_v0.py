import key_google_api
from google.cloud import language
# key = key_google_api.api_key()
# service = build('books', 'v1', developerKey= key)
# GOOGLE_APPLICATION_CREDENTIALS('../Speech_to_text_32321e920f53.json')


def langage_analysis(text):
	client = language.Client()
	document = client.document_from_text(text)
	sent_analysis = document.analyze_sentiment()
	print(dir(sent_analysis))
	sentiment = sent_analysis.sentiment
	ent_analysis = document.analyze_entities()
	entities = ent_analysis.entities
	return sentiment, entities


example_text = 'play The Whit Album from The Beatles'

sentiment, entities = langage_analysis(example_text)

# print(sentiment.score, sentiment.magnitude)

for e in entities:
	print(e.name, e.entity_type, e.metadata, e.salience)

		
