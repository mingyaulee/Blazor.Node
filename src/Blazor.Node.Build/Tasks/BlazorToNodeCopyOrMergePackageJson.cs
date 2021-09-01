using Microsoft.Build.Framework;
using Microsoft.Build.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Blazor.Node.Build.Tasks
{
    public class BlazorToNodeCopyOrMergePackageJson : Task
    {
        private const string LogPrefix = "    ";
        private const string FileName = "package.json";

        [Required]
        public string SourceFolder { get; set; }

        [Required]
        public string DestinationFolder { get; set; }

        public override bool Execute()
        {
            try
            {
                var sourceFilePath = Path.Combine(SourceFolder, FileName);
                var destinationFilePath = Path.Combine(DestinationFolder, FileName);
                if (File.Exists(destinationFilePath))
                {
                    Log.LogMessage(MessageImportance.Normal, $"{LogPrefix}Merging package '{FileName}' with '{destinationFilePath}'");
                    MergeFiles(sourceFilePath, destinationFilePath);
                }
                else
                {
                    Log.LogMessage(MessageImportance.Normal, $"{LogPrefix}Copying '{FileName}' to '{destinationFilePath}'");
                    File.Copy(sourceFilePath, destinationFilePath);
                }

                return true;
            }
            catch (Exception ex)
            {
                Log.LogError($"{LogPrefix}An unexpected error occured when copying or merging file '{FileName}'");
                Log.LogErrorFromException(ex);
                return false;
            }
        }

        private static void MergeFiles(string sourceFile, string destinationFile)
        {
            var sourceJson = JsonSerializer.Deserialize<PackageJson>(File.ReadAllText(sourceFile));
            var destinationJson = JsonSerializer.Deserialize<PackageJson>(File.ReadAllText(destinationFile));

            if (destinationJson.DevDependencies is null)
            {
                destinationJson.DevDependencies = sourceJson.DevDependencies;
            }
            else
            {
                MergeObjects(sourceJson.DevDependencies, destinationJson.DevDependencies);
            }

            var serializedJson = JsonSerializer.Serialize(destinationJson, new JsonSerializerOptions()
            {
                WriteIndented = true
            });
            File.WriteAllText(destinationFile, serializedJson);
        }

        private static void MergeObjects(IDictionary<string, string> sourceObject, IDictionary<string, string> destinationObject)
        {
            foreach (var script in sourceObject)
            {
                if (!destinationObject.ContainsKey(script.Key))
                {
                    destinationObject.Add(script);
                }
            }
        }

        private class PackageJson
        {
            [JsonPropertyName("devDependencies")]
            public IDictionary<string, string> DevDependencies { get; set; }
            
            [JsonExtensionData]
            public IDictionary<string, object> ExtensionData { get; set; }
        }
    }
}
