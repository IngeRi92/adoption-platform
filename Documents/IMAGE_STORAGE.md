# How we store dog pictures

## Agreed approach

PostgreSQL stores the relationship between a dog and its picture, including the picture's storage name. The actual picture is a file: locally in development, and in file/object storage for production. We will keep Django's existing `Dog.photos` ImageField rather than introduce binary image columns.

PostgreSQL can store image bytes. This decision is about keeping database growth, image delivery and maintenance manageable for a small team with a limited charity budget.

## What “relationship” means

For example, a dog row might contain:

| id | name | photos |
| --- | --- | --- |
| 12 | Luna | `dog_photos/luna.jpg` |

The database stores the relative name `dog_photos/luna.jpg`, not the JPG contents. Django's storage system turns that name into a URL. The API returns that URL in `photos`, and the browser requests the file separately.

```text
Frontend -> Django API -> PostgreSQL: dog information + stored image name
Frontend <- Django API: dog information + image URL
Browser  -> image URL: download and display picture
```

During development Django serves the image. In production, object storage and optionally a CDN deliver it. A CDN caches files near visitors so repeated views do not need to reach the application server.

`photos` currently means ONE optional image, despite its plural name. Multiple pictures per dog would need a separately agreed schema/API change, such as a DogPhoto model with a foreign key to Dog.

## Why we chose file storage

| Concern | Image bytes in PostgreSQL | Files with database references |
| --- | --- | --- |
| Database growth | Photos enlarge the database and its backups | Database contains small names/metadata |
| Delivery | Uncached image retrieval requires database/application work | Production storage/CDN can serve images independently |
| Scaling | Image workload shares database resources with search and inquiries | Image storage and delivery scale separately |
| Recovery | Records and image bytes can be backed up together | Both database and files need coordinated recovery arrangements |
| Maintenance | Fewer storage systems, but a larger database to operate | Another storage service to configure, with lighter database operations |

Both approaches can handle thousands of daily visitors and 100 daily uploads when configured properly. Visitor count alone does not determine capacity: photo sizes, images viewed per visit, cache hits and traffic bursts matter. This choice gives us a straightforward growth path, not a promise of unlimited capacity.

## Budget example

Assume 100 **individual pictures** per day at 500 KB each, and 3,000 daily visitors viewing 20 pictures each. Using decimal units and a 30-day month:

- New storage: about 1.5 GB/month, or 18.25 GB after 365 days without deletion.
- Image requests: about 1.8 million/month.
- Image delivery: about 900 GB/month before caching.

If “100 uploads” means 100 dog listings with five pictures each, storage growth is five times larger. Thumbnails, retained originals and backups also add storage.

The lesson is that download traffic can greatly exceed stored data. Compare storage, request, transfer, backup and image-processing charges together. Object storage such as Cloudflare R2 is a candidate; no provider or paid service is configured by this change. Check [current R2 pricing](https://developers.cloudflare.com/r2/pricing/) before deployment rather than treating an estimate as a guaranteed bill.

To control costs before launch, resize oversized photos, generate small search-card thumbnails, compress uploads, set upload limits, lazy-load images and agree how long to retain removed listings' files. These processing and retention features are future work, not implemented by the media configuration.

## Responsibilities

**Database teammate:** document the existing image-name column and optional value. Keep image bytes out of PostgreSQL. Review any future DogPhoto relationship. A database backup alone will not contain the image files.

**Backend teammate:** configure storage and URLs, validate uploads through the supported upload flow, return image URLs, and later implement image processing and file cleanup. Uploads currently happen through authenticated Django admin; public listing writes remain disabled.

**Frontend teammate:** use the API's `photos` URL as received. Do not build URLs from filenames or hardcode the backend hostname. Show a placeholder for `null` or failed images. An ordinary `<img>` can display the image; using Next.js image optimization requires separate frontend configuration for the chosen image origin.

**Backend/database together:** plan backups of both records and files, verify restores, and define deletion/retention behavior. Django does not automatically remove a stored file when its model row is deleted; cleanup must be designed deliberately. Storage durability does not replace protection from accidental deletion.

## Local development setup

The backend now uses:

```python
MEDIA_ROOT = BASE_DIR / "media"
MEDIA_URL = "/media/"
```

- `MEDIA_ROOT` is the disk location: `backend/media/`.
- The model's `upload_to="dog_photos/"` puts uploads under `backend/media/dog_photos/`.
- `MEDIA_URL` is the URL prefix: `/media/dog_photos/example.jpg`.
- The API produces an absolute image URL using the request's host, for example `http://localhost:8000/media/dog_photos/example.jpg`.
- Uploaded files are ignored by Git. Django creates upload subfolders when needed.
- Development media routes are registered only with `DEBUG=True`.

To try it from `backend/`, with dependencies installed and your database configured:

```powershell
python manage.py migrate
python manage.py seed_demo_data
python manage.py createsuperuser
python manage.py runserver
```

If you already have an admin account, skip creating another. Open `http://localhost:8000/admin/`, sign in, edit a dog, select a JPG/PNG in the Photos field and save. Open `/api/dogs/{id}/`, copy its `photos` URL and check that it displays the uploaded picture. The seed command itself does not attach pictures. Check that another dog without an image returns `photos: null`.

Existing records with file names still require matching files under the new media root. If old files exist under `backend/dog_photos/`, copy them into `backend/media/dog_photos/` preserving their relative names, or re-upload through admin. This change does not move or delete old files.

## Production path

Keep the ImageField and configure a production storage backend. Copy existing files preserving their names, verify references, and have the storage backend generate the production URLs. The frontend can continue using `photos`.

Django's development file server is not a production solution. Configure persistent storage, public delivery for listing photos, access controls for uploads, backups and caching before launch. Do not put private inquiry attachments in a publicly served listing-photo folder.

References: [Django file storage](https://docs.djangoproject.com/en/5.2/topics/files/), [development media serving](https://docs.djangoproject.com/en/5.2/howto/static-files/#serving-files-uploaded-by-a-user-during-development).
