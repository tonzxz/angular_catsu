


import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase: SupabaseClient;
  private isLockAcquired = false;

  constructor() {
    const SUPABASE_URL = 'https://hvqvmxakmursjidtfmdj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2cXZteGFrbXVyc2ppZHRmbWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2MDA4MjQsImV4cCI6MjAzNDE3NjgyNH0.dykJM61G-58LEnAyCUU6-irano2f4vraV8t1l8C5KZ8';
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async acquireLock(): Promise<boolean> {
    if (this.isLockAcquired) {
      console.warn('Lock is already acquired');
      return false;
    }
    try {
      console.log('Acquiring lock...');
      this.isLockAcquired = true;
      return true;
    } catch (error) {
      console.error('Failed to acquire lock', error);
      return false;
    }
  }

  releaseLock() {
    console.log('Releasing lock...');
    this.isLockAcquired = false;
  }

  
}

// import { Injectable } from '@angular/core';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// @Injectable({
//   providedIn: 'root',
// })
// export class SupabaseService {
//   supabase: SupabaseClient;
//   private isLockAcquired = false;

//   constructor() {
//     const SUPABASE_URL = 'https://hvqvmxakmursjidtfmdj.supabase.co';
//     const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmF4ZXMiLCJyZWYiOiJodnF2bXhhb211cnNqaWR0Zm1kaiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE4NjAwODI0LCJleHAiOjIwMzQxNzY4MjR9.dykJM61G-58LEnAyCUU6-irano2f4vraV8t1l8C5KZ8';
//     this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
//   }

//   async acquireLock(): Promise<boolean> {
//     if (this.isLockAcquired) {
//       console.warn('Lock is already acquired');
//       return false;
//     }
//     try {
//       console.log('Acquiring lock...');
//       this.isLockAcquired = true;
//       return true;
//     } catch (error) {
//       console.error('Failed to acquire lock', error);
//       return false;
//     }
//   }

//   releaseLock() {
//     console.log('Releasing lock...');
//     this.isLockAcquired = false;
//   }

//   async uploadFileToStorage(bucket: string, file: File): Promise<string | null> {
//     const fileName = `${Date.now()}_${file.name}`;
//     try {
//       const { data, error } = await this.supabase.storage.from(bucket).upload(fileName, file);

//       if (error) {
//         console.error(`Error uploading ${file.name} to bucket ${bucket}:`, error.message);
//         return null;
//       }

//       const { publicUrl } = this.supabase.storage.from(bucket).getPublicUrl(fileName).data;
//       console.log(`Public URL constructed:`, publicUrl);
//       return publicUrl;
//     } catch (e) {
//       console.error(`Unexpected error during file upload:`, e);
//       return null;
//     }
//   }
// }
